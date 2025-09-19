

export interface ApiError {
	message: string
	code?: string
	details?: Record<string, unknown>
}

export interface ApiResponse<T> {
	data: T
	message?: string
	success: boolean
}
