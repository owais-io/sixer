import { SessionProvider } from 'next-auth/react'
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <div className={inter.className}>
        <Component {...pageProps} />
        <Analytics />
        <SpeedInsights />
      </div>
    </SessionProvider>
  )
}