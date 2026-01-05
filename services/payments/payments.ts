import { api } from '@/shared/lib/axios'
import { useQuery } from '@tanstack/react-query'

export interface Payment {
   id: number
   amount: number
   currency: string
   status: 'pending' | 'success' | 'failed'
   orderId: string
   createdAt: string
}

interface PayloadPaginatedResponse<T> {
   docs: T[]
   totalDocs: number
   limit: number
   totalPages: number
   page: number
   pagingCounter: number
   hasPrevPage: boolean
   hasNextPage: boolean
   prevPage: number | null
   nextPage: number | null
}

export const paymentsApi = {
   getHistory: async ( userId: number | string, limit: number = 20, page: number = 1 ): Promise<PayloadPaginatedResponse<Payment>> => {
      const { data } = await api.get<PayloadPaginatedResponse<Payment>>(
         `/payments?where[user][equals]=${userId}&sort=-createdAt&limit=${limit}&page=${page}`
      )
      return data
   },
}

export const usePaymentHistory = ( userId?: string | number ) => {
   return useQuery( {
      queryKey: [ 'payments', 'history', userId ],
      queryFn: () => paymentsApi.getHistory( userId! ),
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
   } )
}
