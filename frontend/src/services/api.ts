import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth (future)
api.interceptors.request.use(
  (config) => {
    // TODO: Add auth token if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle errors globally (toast notifications, etc.)
    return Promise.reject(error)
  }
)

export default api
