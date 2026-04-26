import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://rampupth.com/th',
    languages: {
      'en': 'https://rampupth.com',
      'th': 'https://rampupth.com/th',
    },
  },
}

export default function ThLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
