import AuthGuard from "@/components/auth-guard"

export default function ClassifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}