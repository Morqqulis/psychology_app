import { api } from '@/shared/lib/axios'
import { useQuery } from '@tanstack/react-query'

export interface Specialist {
   id: string | number
   name: string
   specialty: string
   experience: string
   description: string
   image: {
      url?: string | null
      alt?: string | null
   } | string | number | null
   whatsapp?: string | null
   price: number
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

export const specialistsApi = {
   getList: async ( limit: number = 20, page: number = 1 ): Promise<PayloadPaginatedResponse<Specialist>> => {
      const { data } = await api.get<PayloadPaginatedResponse<Specialist>>(
         `/specialists?limit=${limit}&page=${page}&depth=1`
      )
      return data
   },
   getOne: async ( id: string | number ): Promise<Specialist> => {
      const { data } = await api.get<Specialist>( `/specialists/${id}?depth=1` )
      return data
   },
}

export const useSpecialists = () => {
   return useQuery( {
      queryKey: [ 'specialists' ],
      queryFn: () => specialistsApi.getList(),
      staleTime: 5 * 60 * 1000,
   } )
}

export const useSpecialist = ( id: string | number ) => {
   return useQuery( {
      queryKey: [ 'specialists', id ],
      queryFn: () => specialistsApi.getOne( id ),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
   } )
}
