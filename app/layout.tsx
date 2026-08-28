import './globals.css'

export const metadata = { title: 'MarketOS AI', description: 'Global market intelligence workspace' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
