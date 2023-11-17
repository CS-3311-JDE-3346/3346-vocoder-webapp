import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Learn Vocoders',
  description: 'Learn more about vocoders through interactive visualizations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={`light text-foreground bg-background ${inter.className}`}>{children}</body>
      </Providers>
    </html>
  )
}
