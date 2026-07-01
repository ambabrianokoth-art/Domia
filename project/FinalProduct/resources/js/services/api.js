import axios from 'axios'

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    })

    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        // Get CSRF token before authentication requests
        if (config.url && (config.url.includes('login') || config.url.includes('register'))) {
          await this.getCsrfToken()
        }
        
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        
        const message = error.response?.data?.message || error.message || 'An error occurred'
        return Promise.reject(new Error(message))
      }
    )
  }

  async getCsrfToken() {
    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      })
    } catch (error) {
      console.error('Failed to get CSRF token:', error)
    }
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`
    } else {
      delete this.api.defaults.headers.Authorization
    }
  }

  get(url) {
    return this.api.get(url)
  }

  post(url, data) {
    return this.api.post(url, data)
  }

  put(url, data) {
    return this.api.put(url, data)
  }

  delete(url) {
    return this.api.delete(url)
  }

  patch(url, data) {
    return this.api.patch(url, data)
  }
}

export const apiService = new ApiService()