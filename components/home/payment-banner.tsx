import { Colors } from "@/constants/theme"
import { useMainContext } from "@/providers/MainProvider"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface PaymentBannerProps {
   visible: boolean
   onPress: () => void
   onClose: () => void
}

export function PaymentBanner( { visible, onPress, onClose }: PaymentBannerProps ) {
   const { them } = useMainContext()

   if ( !visible ) return null

   return (
      <View
         style={[
            styles.banner,
            {
               backgroundColor: Colors[ them ].surface,
               borderColor: Colors[ them ].lightgray,
            },
         ]}
      >
         <TouchableOpacity
            style={styles.bannerLeft}
            activeOpacity={0.8}
            onPress={onPress}
         >
            <View style={[ styles.pill, { backgroundColor: `${Colors[ them ].primary}22` } ]}>
               <Text style={[ styles.pillText, { color: Colors[ them ].primary } ]}>5 mesaj</Text>
            </View>
            <View style={styles.bannerTextBlock}>
               <Text style={[ styles.bannerTitle, { color: Colors[ them ].text } ]}>
                  Limitsiz AI üçün 5 AZN
               </Text>
               <Text style={styles.bannerSubtitle}>
                  Bitməsin deyə ödə və davam et.
               </Text>
            </View>
         </TouchableOpacity>
         <TouchableOpacity
            style={[ styles.closeButton, { backgroundColor: Colors[ them ].lightgray } ]}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
         >
            <Ionicons name="close" size={18} color={Colors[ them ].icon} />
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create( {
   banner: {
      marginBottom: 10,
      marginHorizontal: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
   },
   bannerLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
   },
   pill: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
   },
   pillText: {
      fontSize: 12,
      fontWeight: "700",
   },
   bannerTextBlock: {
      flex: 1,
      gap: 2,
   },
   bannerTitle: {
      fontSize: 15,
      fontWeight: "700",
   },
   bannerSubtitle: {
      fontSize: 13,
      color: "#ccc",
      lineHeight: 18,
   },
   closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
   },
} )