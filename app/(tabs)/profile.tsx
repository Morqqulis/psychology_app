import { PaymentHistory, ProfileInfo, Settings } from '@/components/profile'
import { Menu } from '@/components/reusable'
import { Colors } from "@/constants/theme"
import { useMainContext } from "@/providers/MainProvider"
import { IProfileLabels, menuItems } from "@/shared/static/menu"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import * as Animatable from "react-native-animatable"

export default function Profile() {
   const [ selectedLabel, setSelectedLabel ] = useState<IProfileLabels>( "profile" )
   const { them } = useMainContext()

   const getIcon = (): keyof typeof Ionicons.glyphMap => {
      switch ( selectedLabel ) {
         case "profile": return "person"
         case "settings": return "settings"
         case "payments": return "card"
         default: return "person"
      }
   }

   return (
      <View
         style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}
      >
         <LinearGradient
            colors={[ Colors[ them ].surface, Colors[ them ].background ]}
            style={styles.header}
         >
            <View style={styles.titleRow}>
               <Ionicons name={getIcon()} size={22} color={Colors[ them ].primary} />
               <Animatable.Text
                  animation="fadeIn"
                  duration={300}
                  key={selectedLabel}
                  style={[ styles.title, { color: Colors[ them ].text } ]}
               >
                  {menuItems[ selectedLabel ]}
               </Animatable.Text>
            </View>
            <View style={styles.btnContainer}>
               <Menu
                  setSelectedLabel={setSelectedLabel}
                  selectedLabel={selectedLabel}
               />
            </View>
         </LinearGradient>

         <Animatable.View animation="fadeInUp" duration={400} key={selectedLabel} style={{ flex: 1 }}>
            {selectedLabel === "profile" && <ProfileInfo />}
            {selectedLabel === "settings" && <Settings />}
            {selectedLabel === "payments" && <PaymentHistory />}
         </Animatable.View>
      </View>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
   },
   header: {
      height: 55,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
   },
   titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
   },
   title: {
      fontSize: 20,
      fontWeight: "700",
      letterSpacing: 0.3,
   },
   btnContainer: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
   },
} )
