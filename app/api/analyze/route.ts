import { analyzeS3Document } from '@/lib/openai-document-analysis'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 })
    }

    // Fetch document from database
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('owner_id', user.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Analyze document using OpenAI
    const analysis = await analyzeS3Document(document.s3_key, document.file_name)

    // Update document with analysis results
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        plain_english_summary: analysis.plain_english_summary,
        important_dates_and_deadlines: analysis.important_dates_and_deadlines,
        payments_amounts_balances: analysis.payments_amounts_balances,
        ai_analysis: analysis,
        status: 'analyzed',
      })
      .eq('id', documentId)
      .eq('owner_id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ analysis })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[analyze]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
