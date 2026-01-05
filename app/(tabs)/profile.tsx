import { PaymentHistory, ProfileInfo, Settings } from '@/components/profile'
import { Menu } from '@/components/reusable'
import { Colors } from "@/constants/theme"
import { useMainContext } from "@/providers/MainProvider"
import { IProfileLabels, menuItems } from "@/shared/static/menu"
import React, { useState } from "react"
import { StyleSheet, Text, View } from "react-native"

export default function Profile() {
   const [ selectedLabel, setSelectedLabel ] = useState<IProfileLabels>( "profile" )
   const { them } = useMainContext()

   const color = them === "dark" ? Colors[ them ].text : Colors[ them ].blue

   return (
      <View
         style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}
      >
         <View
            style={[ styles.header, { borderBottomColor: Colors[ them ].charcoal } ]}
         >
            <Text style={[ styles.title, { color } ]}>
               {menuItems[ selectedLabel ]}
            </Text>
            <View style={styles.btnContainer}>
               <Menu
                  setSelectedLabel={setSelectedLabel}
                  selectedLabel={selectedLabel}
               />
            </View>
         </View>

         {selectedLabel === "profile" && <ProfileInfo />}
         {selectedLabel === "settings" && <Settings />}
         {selectedLabel === "payments" && <PaymentHistory />}
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
      paddingHorizontal: 10,
      borderBottomWidth: 0.5,
   },
   title: {
      fontSize: 18,
      fontWeight: "600",
   },
   btnContainer: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
   },
} )
