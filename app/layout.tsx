import './globals.css'
import AppShell from '@/components/AppShell'

export const metadata = { title: 'MarketOS AI', description: 'Global market intelligence workspace' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><AppShell>{children}</AppShell></body></html>
}
