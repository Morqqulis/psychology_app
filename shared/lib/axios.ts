import axios, { AxiosError, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		'Content-Type': 'Authrization',
	},
})

api.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

api.interceptors.response.use(
	(response: AxiosResponse) => {
		return response
	},
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			console.warn('Unauthorized access - consider redirecting to login')
		}
		
		if (error.response?.status && error.response.status >= 500) {
			console.error('Server error:', error.response?.data)
		}
		
		return Promise.reject(error)
	}
)

export default api