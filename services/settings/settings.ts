import { api } from '@/shared/lib/axios'
import { useQuery } from '@tanstack/react-query'

export interface AppSettings {
   paymentAmount: number
   vipDuration: number
   freeMessageLimit: number
}

export const settingsApi = {
   get: async (): Promise<AppSettings> => {
      const { data } = await api.get<AppSettings>( '/settings' )
      return data
   },
}

export const useSettings = () => {
   return useQuery( {
      queryKey: [ 'settings' ],
      queryFn: settingsApi.get,
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
   } )
}
