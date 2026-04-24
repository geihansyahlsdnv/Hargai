export const PROTECTED_ROUTES = [
  "/pricing",       // Profile
  "/consultation",  // Klasifikasi
  "/blog",    // Audit
  "/services",      // Riwayat
  "/testimonials",  // Laporan
] as const

export const isProtectedPath = (pathname: string) => {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}