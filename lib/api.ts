import axios from "axios"

export const api = axios.create({
  baseURL: "/api",
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)