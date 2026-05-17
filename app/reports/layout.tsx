import AuthGuard from "@/components/auth-guard"

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}