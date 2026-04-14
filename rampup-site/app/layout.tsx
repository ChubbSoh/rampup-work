import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Restaurant RampUp — Grow Your Restaurant Sales',
  description:
    'Thailand\'s leading restaurant social media & Grab marketing agency. We grow your Grab revenue and build your brand on Instagram, TikTok, and Facebook.',
  keywords: 'restaurant marketing Thailand, Grab Food marketing, restaurant social media Bangkok',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
