import { createHmac, timingSafeEqual } from 'crypto'

type InvitePayload = {
  ownerId: string
  role: 'Family' | 'Emergency'
  exp: number
}

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60
export const INVITE_COOKIE = 'anchor_invites'

export function createInviteToken(ownerId: string, role: 'Family' | 'Emergency') {
  const payload: InvitePayload = {
    ownerId,
    role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  }
  const body = base64UrlEncode(JSON.stringify(payload))
  const signature = sign(body)

  return `${body}.${signature}`
}

export function verifyInviteToken(token: string): InvitePayload | null {
  const [body, signature] = token.split('.')

  if (!body || !signature) return null

  const expected = sign(body)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as InvitePayload

    if (!payload.ownerId || !payload.role || payload.exp < Date.now() / 1000) {
      return null
    }

    if (payload.role !== 'Family' && payload.role !== 'Emergency') {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function encodeInviteCookie(tokens: string[]) {
  return tokens
    .filter((token, index, all) => token && all.indexOf(token) === index)
    .slice(-5)
    .join('~')
}

export function decodeInviteCookie(value: string | undefined) {
  if (!value) return []

  return value
    .split('~')
    .map((token) => token.trim())
    .filter(Boolean)
}

function sign(value: string) {
  return createHmac('sha256', getInviteSecret()).update(value).digest('base64url')
}

function getInviteSecret() {
  const secret =
    process.env.INVITE_SECRET ||
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.OPENAI_API_KEY

  if (!secret) {
    throw new Error('Invite signing secret is not configured')
  }

  return secret
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}
