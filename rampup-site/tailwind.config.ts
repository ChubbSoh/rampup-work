import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#EDEDED',
        green: '#3DBE5A',
        'green-light': '#E8F8ED',
        dark: '#2D2D2D',
        body: '#3D3D3D',
        muted: '#888888',
        faint: '#AAAAAA',
        card: '#FFFFFF',
        border: 'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      borderRadius: {
        pill: '100px',
        card: '16px',
        img: '14px',
        tag: '100px',
      },
      maxWidth: {
        site: '1200px',
      },
    },
  },
  plugins: [],
}

export default config
