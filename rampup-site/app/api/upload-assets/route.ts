import { NextRequest, NextResponse } from 'next/server'

const GITHUB_API = 'https://api.github.com/repos/ChubbSoh/rampup-work/contents/rampup-site/data/clients.json'

function githubHeaders() {
  return {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'rampup-control-panel',
  }
}

export async function POST(req: NextRequest) {
  const cfAccountId = process.env.CF_ACCOUNT_ID
  const cfToken     = process.env.CF_IMAGES_TOKEN
  const githubToken = process.env.GITHUB_TOKEN

  if (!cfAccountId || !cfToken || !githubToken) {
    return NextResponse.json(
      { error: 'Missing env: CF_ACCOUNT_ID, CF_IMAGES_TOKEN, or GITHUB_TOKEN' },
      { status: 500 }
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const slug       = (formData.get('slug') as string | null)?.trim()
  const uploadType = (formData.get('upload_type') as string | null)?.trim()
  const files      = formData.getAll('files') as File[]

  if (!slug)       return NextResponse.json({ error: 'slug is required' }, { status: 400 })
  if (!uploadType) return NextResponse.json({ error: 'upload_type is required' }, { status: 400 })
  if (!['feed-design', 'monthly-plan'].includes(uploadType)) {
    return NextResponse.json({ error: 'upload_type must be feed-design or monthly-plan' }, { status: 400 })
  }
  if (files.length === 0) return NextResponse.json({ error: 'No files provided' }, { status: 400 })

  // ── 1. Upload each file to Cloudflare Images ──────────────────────────────
  const urls: string[] = []
  for (const file of files) {
    const body = new FormData()
    body.append('file', file)

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/images/v1`,
      { method: 'POST', headers: { Authorization: `Bearer ${cfToken}` }, body }
    )
    const cfData = await cfRes.json() as { success: boolean; result?: { variants: string[] }; errors?: unknown[] }

    if (!cfData.success || !cfData.result) {
      return NextResponse.json(
        { error: `Cloudflare upload failed for ${file.name}`, detail: cfData.errors },
        { status: 502 }
      )
    }
    urls.push(cfData.result.variants[0])
  }

  // ── 2. Read current clients.json from GitHub ──────────────────────────────
  const ghRead = await fetch(GITHUB_API, { headers: githubHeaders() })
  if (!ghRead.ok) {
    return NextResponse.json({ error: `GitHub read failed: ${ghRead.status}` }, { status: 502 })
  }
  const ghData = await ghRead.json() as { content: string; sha: string }
  const decoded    = Buffer.from(ghData.content.replace(/\n/g, ''), 'base64').toString('utf8')
  const jsonFile   = JSON.parse(decoded) as { clients: Record<string, unknown>[] }
  const clients    = jsonFile.clients

  // ── 3. Find and update the client record ──────────────────────────────────
  const idx = clients.findIndex(c => c.slug === slug)
  if (idx === -1) {
    return NextResponse.json({ error: `Client not found: ${slug}` }, { status: 404 })
  }

  const fieldName = uploadType === 'feed-design' ? 'feed_design' : 'monthly_plan'
  clients[idx][fieldName]     = uploadType === 'feed-design' ? urls[0] : urls
  clients[idx].last_updated   = new Date().toISOString().slice(0, 10)

  // ── 4. Commit updated clients.json to GitHub (triggers Netlify rebuild) ───
  const updatedContent = Buffer.from(JSON.stringify(jsonFile, null, 2)).toString('base64')
  const ghWrite = await fetch(GITHUB_API, {
    method: 'PUT',
    headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Upload ${uploadType} for ${slug}`,
      content: updatedContent,
      sha: ghData.sha,
    }),
  })

  if (!ghWrite.ok) {
    const detail = await ghWrite.text().catch(() => '')
    return NextResponse.json({ error: `GitHub commit failed: ${ghWrite.status}`, detail }, { status: 502 })
  }

  return NextResponse.json({ ok: true, field: fieldName, urls, count: urls.length })
}
