import { getCookie, removeCookie } from "@/functions/cookieActions"
import { queryClient } from "@/shared/lib/query-client"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { router } from "expo-router"

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://psychology-eosin.vercel.app/api"

let isHandling401 = false

const handle401 = async () => {
   if ( isHandling401 ) return
   isHandling401 = true

   try {
      await removeCookie( "token" )
      await AsyncStorage.removeItem( "nur_yolu_cache" )
      queryClient.clear()
      router.replace( "/auth/login" )
   } finally {
      setTimeout( () => {
         isHandling401 = false
      }, 1000 )
   }
}

export const api = axios.create( {
   baseURL: BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
} )

api.interceptors.request.use( async ( config ) => {
   const token = await getCookie( "token" )
   if ( token ) {
      config.headers.Authorization = `JWT ${token}`
   }
   return config
} )

api.interceptors.response.use(
   ( response ) => response,
   async ( error ) => {
      // Don't handle 401 for login endpoint to prevent loop/reload
      if ( error.response?.status === 401 && !error.config?.url?.includes( "/users/login" ) ) {
         await handle401()
      }
      return Promise.reject( error )
   }
)

export const uploadApi = axios.create( {
   baseURL: BASE_URL,
   headers: {
      "Content-Type": "multipart/form-data",
   },
} )

uploadApi.interceptors.request.use( async ( config ) => {
   const token = await getCookie( "token" )
   if ( token ) {
      config.headers.Authorization = `JWT ${token}`
   }
   return config
} )

uploadApi.interceptors.response.use(
   ( response ) => response,
   async ( error ) => {
      if ( error.response?.status === 401 ) {
         await handle401()
      }
      return Promise.reject( error )
   }
)

export default api
