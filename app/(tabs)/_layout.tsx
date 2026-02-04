import { HapticTab } from "@/components/ui/haptic-tab"
import { Colors } from "@/constants/theme"
import { useMainContext } from "@/providers/MainProvider"
import { useUserContext } from "@/providers/UserProvider"
import { Ionicons } from '@expo/vector-icons'
import { Redirect, ScreenProps, Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"

const defaultOptions: ScreenProps[ "options" ] = {
   //   animation: "shift",
}
export default function TabLayout() {
   const { them } = useMainContext()
   const { user, loading } = useUserContext()

   if ( !loading && !user?.id ) {
      return <Redirect href={"/auth/login"} />
   }


   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors[ them ].surface }} edges={[ "top", "bottom" ]}>
         <StatusBar style={them === 'dark' ? 'light' : 'dark'} />
         <Tabs
            screenOptions={{
               tabBarShowLabel: true,
               tabBarActiveTintColor: Colors[ them ].tint,
               tabBarInactiveTintColor: Colors[ them ].icon,
               tabBarStyle: {
                  backgroundColor: Colors[ them ].surface,
                  borderTopWidth: 0,
                  height: 60,
                  paddingTop: 8,
                  paddingBottom: 8,
               },
               tabBarLabelStyle: {
                  fontSize: 11,
                  marginTop: 2,
               },
               tabBarLabelPosition: "below-icon",
               headerShown: false,
               tabBarButton: HapticTab,
            }}
         >
            <Tabs.Screen
               name="home"
               options={{
                  title: "Əsas səhifə",
                  tabBarIcon: ( { color } ) => (
                     <Ionicons name="home" size={28} color={color} />
                  ),
                  ...defaultOptions,
                  animation: 'fade',
               }}
            />
            <Tabs.Screen
               name="profile"
               options={{
                  title: "Hesab",
                  tabBarIcon: ( { color } ) => (
                     <Ionicons name="person" size={28} color={color} />
                  ),
                  ...defaultOptions,
                  animation: 'fade',

               }}
            />
         </Tabs>
      </SafeAreaView>
   )
}
