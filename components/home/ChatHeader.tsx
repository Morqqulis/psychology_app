import { Colors } from "@/constants/theme"
import { useMainContext } from "@/providers/MainProvider"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import React from "react"
import { StyleSheet, Text, View } from "react-native"

export function ChatHeader() {
   const { them } = useMainContext()

   return (
      <LinearGradient
         colors={[ Colors[ them ].surface, Colors[ them ].background ]}
         style={styles.container}
      >
         <View style={styles.titleContainer}>
            <Ionicons name="sparkles" size={20} color={Colors[ them ].primary} style={{ marginRight: 8 }} />
            <Text style={[ styles.title, { color: Colors[ them ].text } ]}>Nur Yolu</Text>
            <View
               style={[
                  styles.onlineIndicator,
                  { backgroundColor: Colors[ them ].success },
               ]}
            />
         </View>
      </LinearGradient>
   )
}

const styles = StyleSheet.create( {
   container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 55,
      paddingTop: 4,
   },
   titleContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   title: {
      fontSize: 22,
      fontWeight: "700",
      marginRight: 8,
      letterSpacing: 0.5,
   },
   onlineIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
   },
} )
