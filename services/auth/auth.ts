import { api } from '@/shared/lib/axios'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/services/auth/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ApiResponse } from '@/shared/lib/types/api'

export const authApi = {
	login: async (credentials: LoginRequest): Promise<AuthResponse> => {
		const { data } = await api.post<ApiResponse<AuthResponse>>('/customers/login', credentials)
		return data.data
	},

	register: async (userData: RegisterRequest): Promise<AuthResponse> => {
		const { data } = await api.post<ApiResponse<AuthResponse>>('/customers', userData)
		return data.data
	},

	getProfile: async (): Promise<User> => {
		const { data } = await api.get<ApiResponse<User>>('/customers/me')
		return data.data
	},

	logout: async (): Promise<void> => {
		await api.post('/customers/logout')
	},
}

export const useLogin = () => {
	return useMutation({
		mutationFn: authApi.login,
		onSuccess: data => {
			console.log('Login successful:', data.user.email)
		},
		onError: error => {
			console.error('Login failed:', error)
		},
	})
}

export const useRegister = () => {
	return useMutation({
		mutationFn: authApi.register,
		onSuccess: data => {
			console.log('Registration successful:', data.user.email)
		},
		onError: error => {
			console.error('Registration failed:', error)
		},
	})
}

export const useProfile = () => {
	return useQuery({
		queryKey: ['profile'],
		queryFn: authApi.getProfile,
		enabled: false,
	})
}

export const useLogout = () => {
	return useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => {
			console.log('Logout successful')
		},
	})
}
