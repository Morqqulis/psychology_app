import { getCookie } from "@/functions/cookieActions"
import { BadgeToast } from "@/hooks/showBadge"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
   DarkTheme,
   DefaultTheme,
   ThemeProvider,
} from "@react-navigation/native"
import * as Linking from "expo-linking"
import { StatusBar } from "expo-status-bar"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useColorScheme } from "react-native"
import Toast from "react-native-toast-message"
import { UserProvider } from "./UserProvider"
export { useColorScheme } from "react-native"

export type IThemNames = "dark" | "light"
interface IMainContext {
   them: IThemNames
   setThem: React.Dispatch<React.SetStateAction<IThemNames>>
}

const MainContext = createContext<IMainContext>( {
   them: "dark",
   setThem: () => { },
} as IMainContext )

export const useMainContext = () => useContext( MainContext )
export const MainProvider = ( { children }: { children: React.ReactNode } ) => {
   const [ them, setThem ] = useState<IThemNames>( "dark" )
   const colorScheme = useColorScheme()
   const isDark = colorScheme === "dark"

   const getTheme = async () => {
      const theme = await getCookie( "theme" )
      if ( theme ) {
         setThem( theme )
      } else {
         setThem( isDark ? "dark" : "light" )
      }
   }

   useEffect( () => {
      getTheme()
   }, [] )

   useEffect( () => {
      const handleDeepLink = async ( url: string ) => {
         const parsed = Linking.parse( url )
         if ( parsed.path === "pay/success" ) {
            Toast.show( { type: "success", text1: "Ödəniş uğurla tamamlandı" } )
         }
         if ( parsed.path === "pay/error" ) {
            Toast.show( { type: "error", text1: "Ödəniş baş tutmadı" } )
         }
         if ( parsed.path?.startsWith( "ref/" ) ) {
            const code = parsed.path.replace( "ref/", "" )
            if ( code ) {
               await AsyncStorage.setItem( "referralCode", code )
               Toast.show( { type: "info", text1: "Dəvət kodu saxlanıldı" } )
            }
         }
      }

      const listen = Linking.addEventListener( "url", ( event ) => {
         handleDeepLink( event.url )
      } )

      Linking.getInitialURL().then( ( initialUrl ) => {
         if ( initialUrl ) {
            handleDeepLink( initialUrl )
         }
      } )

      return () => {
         listen.remove()
      }
   }, [] )

   const contextValue = useMemo<IMainContext>( () => {
      return {
         them,
         setThem,
      }
   }, [ them ] )

   return (
      <MainContext.Provider value={contextValue}>
         <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <UserProvider>
               {children}
               <BadgeToast />
               <StatusBar style="auto" />
            </UserProvider>
         </ThemeProvider>
      </MainContext.Provider>
   )
}
