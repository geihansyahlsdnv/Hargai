import AuthGuard from "@/components/auth-guard"

export default function AuditsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}