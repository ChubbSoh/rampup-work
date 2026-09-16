/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // A live Instagram ad points at /funnel/oksasan/, a typo for a page that
      // never existed - Okasan's funnel lives at /lp/okasan/. The correctly
      // spelled /funnel/okasan/ is covered too, because that is what the ad is
      // most likely to be "fixed" to, and it would 404 just the same.
      // Query strings pass through, so the ad's UTM tags survive the hop.
      { source: '/funnel/oksasan', destination: '/lp/okasan/', permanent: true },
      { source: '/funnel/okasan', destination: '/lp/okasan/', permanent: true },
    ]
  },
}

module.exports = nextConfig
