import { addCookie } from "@/functions/cookieActions"
import { useProfile } from "@/services/auth/auth"
import api from "@/shared/lib/axios"
import { IUser } from "@/shared/lib/types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext, useEffect, useState } from "react"

interface IUserContext {
   user: IUser | undefined
   loading: boolean
   setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>
}

const UserContext = createContext<IUserContext>( {
   user: {} as IUser | undefined,
   loading: false,
   setUser: () => { },
} )

export const useUserContext = () => useContext( UserContext )

export const UserProvider = ( { children }: { children: React.ReactNode } ) => {
   const [ user, setUser ] = useState<IUser | undefined>( undefined )
   const { data, isLoading, error } = useProfile()
   useEffect( () => {
      if ( !isLoading && data?.token && data.user.id ) {
         const {
            createdAt,
            email,
            gender,
            id,
            name,
            role,
            surname,
            updatedAt,
            status,
            totalMessagesUsed,
            invitedCount,
            referralCode,
            referredBy,
         } = data.user
         setUser( {
            createdAt,
            email,
            gender,
            id,
            name,
            role,
            surname,
            updatedAt,
            status,
            totalMessagesUsed,
            invitedCount,
            referralCode,
            referredBy,
         } )
         addCookie( "token", data.token )
      }
   }, [ data, isLoading ] )

   useEffect( () => {
      if ( error ) {
         setUser( undefined )
      }
   }, [ error ] )

   useEffect( () => {
      const applyReferral = async () => {
         if ( !user || user.referredBy ) return
         const code = await AsyncStorage.getItem( "referralCode" )
         if ( !code ) return
         try {
            await api.post( "/referrals/claim", { referralCode: code } )
            await AsyncStorage.removeItem( "referralCode" )
         } catch {
            // silent
         }
      }
      applyReferral()
   }, [ user ] )
   return (
      <UserContext.Provider
         value={{
            user,
            setUser,
            loading: isLoading,
         }}
      >
         {children}
      </UserContext.Provider>
   )
}
