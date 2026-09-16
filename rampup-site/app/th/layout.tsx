import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    // Fallback only; each Thai page sets its own. './' keeps a page that
    // forgets from claiming to be a copy of /th.
    canonical: './',
    languages: {
      'en': '/',
      'th': '/th',
    },
  },
}

export default function ThLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
