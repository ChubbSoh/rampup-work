import type { Metadata } from 'next'
import Script from 'next/script'
import { Sora, Poppins } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

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
    <html lang="en" className={`${sora.variable} ${poppins.variable}`}>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NPZTB44L" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} /></noscript>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MXCPYX09G5"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());
          gtag('config','G-MXCPYX09G5');
        `}</Script>
        <Script id="gtm-init" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NPZTB44L');
        `}</Script>
      </body>
    </html>
  )
}
