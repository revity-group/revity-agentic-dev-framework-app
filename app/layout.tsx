import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pet Adoption Melbourne',
  description: 'Find your perfect companion - adopt a cat in Melbourne',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
