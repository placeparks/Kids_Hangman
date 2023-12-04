import { Inter } from 'next/font/google'
import './globals.css'
import SupabaseProvider from "../supabase-provider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hangman',
  description: 'Play and Win',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <>
      <SupabaseProvider>{children}</SupabaseProvider>
        </>
        </body>
    </html>
  )
}