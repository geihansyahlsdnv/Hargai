"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout, isAuthenticated } from "@/lib/auth"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoggedIn(isAuthenticated())
  }, [])

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    router.push("/login")
  }

  const navLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/classify", label: "Klasifikasi" },
    { href: "/audits", label: "Audit" },
    { href: "/history", label: "Riwayat" },
    { href: "/reports", label: "Laporan" },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-serif font-black text-cyan-600">
              HargAI
            </Link>

            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {loggedIn ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-cyan-600 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {loggedIn ? (
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-cyan-600 hover:text-cyan-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
