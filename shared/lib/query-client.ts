import { QueryClient, focusManager, onlineManager } from '@tanstack/react-query'
import { AppState, Platform } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { AxiosError } from 'axios'


focusManager.setEventListener(handleFocus => {
	if (Platform.OS !== 'web') {
		const subscription = AppState.addEventListener('change', state => {
			handleFocus(state === 'active')
		})
		return () => subscription?.remove()
	}
})

onlineManager.setEventListener(setOnline => {
	return NetInfo.addEventListener(state => {
		setOnline(!!state.isConnected)
	})
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			gcTime: 10 * 60 * 1000,
			retry: (failureCount, error: Error) => {
				const axiosError = error as AxiosError
				if (axiosError?.response?.status === 404) return false
				if (axiosError?.response?.status === 401) return false
				if (axiosError?.response?.status === 403) return false
				return failureCount < 3
			},
			retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
			refetchOnMount: true,
		},
		mutations: {
			retry: (failureCount, error: Error) => {
				const axiosError = error as AxiosError
				if (axiosError?.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
					return false
				}
				return failureCount < 2
			},
			retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // 30s max retry delay
		},
	},
})