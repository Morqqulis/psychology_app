import axios from 'axios'

const BASE_URL = 'https://psychology-eosin.vercel.app/api'

export const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(config => {
	return config
})

api.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response?.status === 401) {
			console.error('Unauthorized access')
		}
		if (error.response?.status >= 500) {
			console.error('Server error')
		}
		return Promise.reject(error)
	}
)

export default api