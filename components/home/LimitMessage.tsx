import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

export const LimitMessage = () => {
   const { them } = useMainContext()

   return (
      <View style={[ styles.container, { backgroundColor: Colors[ them ].surface } ]}>
         <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={32} color={Colors[ them ].primary} />
         </View>
         <Text style={[ styles.title, { color: Colors[ them ].text } ]}>
            Mesaj limitinə çatdınız
         </Text>
         <Text style={[ styles.description, { color: Colors[ them ].text } ]}>
            VIP üzvlər limitsiz mesaj yaza bilər. Daha çox pulsuz mesaj üçün dostlarınızı dəvət edin.
         </Text>
      </View>
   )
}

const styles = StyleSheet.create( {
   container: {
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
   },
   iconContainer: {
      marginBottom: 12,
   },
   title: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 8,
      textAlign: 'center',
   },
   description: {
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
   },
} )
