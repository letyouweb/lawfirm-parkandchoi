import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Law Firm - Park & Choi',
  description: 'Law Firm Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

