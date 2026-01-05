import { HapticTab } from "@/components/ui/haptic-tab"
import { Colors } from "@/constants/theme"
import { useMainContext } from "@/providers/MainProvider"
import { Ionicons } from '@expo/vector-icons'
import { ScreenProps, Tabs } from "expo-router"
import React from "react"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const defaultOptions: ScreenProps[ "options" ] = {
   //   animation: "shift",
}
export default function TabLayout() {
   const { them } = useMainContext()



   return (
      <SafeAreaView style={{ flex: 1 }} edges={[ "top" ]}>
         <Tabs
            screenOptions={{
               tabBarShowLabel: true,
               tabBarActiveTintColor: Colors[ them ].tint,
               tabBarInactiveTintColor: Colors[ them ].tabIconDefault,

               tabBarBackground: () => (
                  <View
                     style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor: "none",
                        backgroundColor: "#2c3e50",
                     }}
                  >
                     <View style={{}} />
                  </View>
               ),
               tabBarLabelStyle: {
                  fontSize: 11,
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
               }}
            />
         </Tabs>
      </SafeAreaView>
   )
}
