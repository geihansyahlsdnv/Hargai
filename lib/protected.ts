export const PROTECTED_ROUTES = [
  "/profile",       // Profile
  "/classify",  // Klasifikasi
  "/audits",    // Audit
  "/history",      // Riwayat
  "/reports",  // Laporan
] as const

export const isProtectedPath = (pathname: string) => {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}