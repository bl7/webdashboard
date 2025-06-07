import { SupportLayout } from "@/components/blocks/legal/layout"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SupportLayout>{children}</SupportLayout>
}
