import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { sdkStreamMixin } from '@aws-sdk/util-stream-node'
import OpenAI from 'openai'

interface DocumentAnalysis {
  plain_english_summary: string
  important_dates_and_deadlines: Array<{
    date: string
    description: string
    urgency: 'urgent' | 'soon' | 'normal' | 'unknown'
    source_text: string
  }>
  payments_amounts_balances: Array<{
    amount: string
    description: string
    due_date_if_available: string
    source_text: string
  }>
}

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
}

function getOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

async function downloadFromS3(s3Key: string): Promise<Buffer> {
  const s3 = getS3Client()
  const bucket = process.env.AWS_S3_BUCKET!

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: s3Key,
    }),
  )

  if (!response.Body) {
    throw new Error('No body returned from S3')
  }

  // Handle streaming response
  const stream = sdkStreamMixin(response.Body)
  const chunks: Buffer[] = []

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    stream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    stream.on('error', reject)
  })
}

function encodeFileToBase64(buffer: Buffer, fileName: string): { encoded: string; mimeType: string } {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''

  let mimeType = 'application/octet-stream'
  if (ext === 'pdf') mimeType = 'application/pdf'
  else if (['jpg', 'jpeg'].includes(ext)) mimeType = 'image/jpeg'
  else if (ext === 'png') mimeType = 'image/png'
  else if (ext === 'gif') mimeType = 'image/gif'
  else if (ext === 'webp') mimeType = 'image/webp'

  const encoded = buffer.toString('base64')
  return { encoded, mimeType }
}

async function analyzeDocumentWithOpenAI(buffer: Buffer, fileName: string): Promise<DocumentAnalysis> {
  const client = getOpenAIClient()
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const { encoded, mimeType } = encodeFileToBase64(buffer, fileName)

  const prompt = `You are analyzing an uploaded document for Anchor, an AI crisis triage dashboard.
Your job is to extract only 3 categories of information.
Return JSON only.
Do not guess.
Only include information that is visible or strongly supported by the document.
If a section has no matching information, return an empty list.
Do not give legal, medical, or financial advice.

The JSON must contain:
1. plain_english_summary
A detailed plain-English summary of the document.
This summary will be saved in the database and reused later as AI context.
Explain what the document is, who it appears to involve, why it matters, and what the user should understand.
Keep it clear and calm.

2. important_dates_and_deadlines
All important dates, deadlines, due dates, expiry dates, billing dates, appointment dates, claim dates, hearing dates, response deadlines, or time-sensitive actions.

3. payments_amounts_balances
All payments, amounts, balances, charges, fees, deposits, discounts, refunds, taxes, totals, insurance amounts, or money-related values.`

  if (mimeType !== 'application/pdf' && !mimeType.startsWith('image/')) {
    throw new Error(
      `Unsupported file type: ${mimeType}. Only PDF, JPG, JPEG, PNG, GIF, and WEBP are supported.`,
    )
  }

  let uploadedFileId: string | undefined

  try {
    const content =
      mimeType === 'application/pdf'
        ? [
            { type: 'input_text', text: prompt },
            {
              type: 'input_file',
              file_id: await uploadFileForAnalysis(client, buffer, fileName, mimeType).then(
                (id) => {
                  uploadedFileId = id
                  return id
                },
              ),
            },
          ]
        : [
            { type: 'input_text', text: prompt },
            {
              type: 'input_image',
              image_url: `data:${mimeType};base64,${encoded}`,
            },
          ]

    const response = await client.responses.create({
      model,
      input: [
        {
          role: 'user',
          content,
        },
      ],
      max_output_tokens: 4096,
    } as Parameters<typeof client.responses.create>[0])

    const responseText = (response as { output_text?: string }).output_text

    if (!responseText) {
      throw new Error('Empty OpenAI analysis response')
    }

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in OpenAI response')
    }

    return JSON.parse(jsonMatch[0]) as DocumentAnalysis
  } finally {
    if (uploadedFileId) {
      client.files.del(uploadedFileId).catch(() => {})
    }
  }
}

async function uploadFileForAnalysis(
  client: OpenAI,
  buffer: Buffer,
  fileName: string,
  mimeType: string,
) {
  const blob = new Blob([buffer], { type: mimeType })
  const file = new File([blob], fileName, { type: mimeType })
  const uploaded = await client.files.create({ file, purpose: 'assistants' })

  return uploaded.id
}

export async function analyzeS3Document(s3Key: string, fileName: string): Promise<DocumentAnalysis> {
  const buffer = await downloadFromS3(s3Key)
  const analysis = await analyzeDocumentWithOpenAI(buffer, fileName)
  return analysis
}
