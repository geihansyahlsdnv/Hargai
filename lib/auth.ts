export async function login(username: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw res
  const data = await res.json()
  localStorage.setItem("access_token", data.access_token)

  // ambil info user dari /users/me
  const meRes = await fetch("/api/users/me", {
    headers: { Authorization: `Bearer ${data.access_token}` },
  })
  if (!meRes.ok) throw new Error("Gagal mengambil data user")
  const user = await meRes.json()
  localStorage.setItem("user", JSON.stringify(user))
  return user
}