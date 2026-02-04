import { addCookie } from "@/functions/cookieActions"
import type {
   AuthResponse,
   LoginRequest,
   LoginResponse,
   RegisterRequest,
   RegisterResponse,
} from "@/services/auth/types"
import { api } from "@/shared/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const authApi = {
   login: async ( credentials: LoginRequest ): Promise<LoginResponse> => {
      const { data } = await api.post<LoginResponse>( "/users/login", credentials )
      return data
   },

   register: async ( userData: RegisterRequest ): Promise<RegisterResponse> => {
      const { data } = await api.post<RegisterResponse>( "/users", userData )
      return data
   },

   getProfile: async (): Promise<AuthResponse> => {
      const { data } = await api.get<AuthResponse>( "/users/me" )
      return data
   },

   logout: async (): Promise<void> => {
      await api.post( "/users/logout" )
   },
}

export const getAuthErrorMessage = ( error: unknown ): string => {
   const err = error as { response?: { data?: { message?: string }; status?: number } }
   if ( err?.response?.data?.message ) {
      return err.response.data.message
   }
   if ( err?.response?.status === 400 ) {
      return "Yanlış məlumatlar daxil edilib"
   }
   if ( err?.response?.status === 401 ) {
      return "Email və ya parol yanlışdır"
   }
   if ( err?.response?.status === 409 ) {
      return "Bu email artıq istifadə olunur"
   }
   if ( err?.response?.status && err.response.status >= 500 ) {
      return "Server xətası baş verdi"
   }
   return "Xəta baş verdi"
}


export const useLogin = () => {
   const queryClient = useQueryClient()
   return useMutation( {
      mutationFn: authApi.login,
      onSuccess: async ( data ) => {
         await addCookie( "token", data.token )
         queryClient.removeQueries( { queryKey: [ "profile" ] } )
         queryClient.removeQueries( { queryKey: [ "chat" ] } )
      },
   } )
}

export const useRegister = () => {
   return useMutation( {
      mutationFn: authApi.register,
   } )
}

export const useProfile = () => {
   return useQuery( {
      queryKey: [ "profile" ],
      queryFn: authApi.getProfile,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3,
      enabled: true,
   } )
}

export const useLogout = () => {
   return useMutation( {
      mutationFn: authApi.logout,
   } )
}
