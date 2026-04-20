// Server-only — never import this from a 'use client' component.
// Builds Cloudflare Stream iframe URLs from env vars.

export function streamIframeSrc(
  videoId: string,
  options: { muted?: boolean; autoplay?: boolean; loop?: boolean } = {}
): string | null {
  const code = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE
  if (!code) {
    console.warn('[stream] CLOUDFLARE_STREAM_CUSTOMER_CODE is not set — skipping video', videoId)
    return null
  }
  const params = new URLSearchParams({ primaryColor: '3DBE5A' })
  if (options.muted)    params.set('muted', 'true')
  if (options.autoplay) params.set('autoplay', 'true')
  if (options.loop)     params.set('loop', 'true')
  return `https://customer-${code}.cloudflarestream.com/${videoId}/iframe?${params}`
}
