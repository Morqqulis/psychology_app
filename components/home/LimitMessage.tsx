import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { AnimatedButton } from '../ui/animated-button'

interface LimitMessageProps {
   onUpgrade: () => void
   isPaying: boolean
   paymentAmount: number
}

export const LimitMessage = ( { onUpgrade, isPaying, paymentAmount }: LimitMessageProps ) => {
   const { them } = useMainContext()

   return (
      <View style={[ styles.container, { backgroundColor: Colors[ them ].surface } ]}>
         <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={32} color={Colors[ them ].primary} />
         </View>
         <Text style={[ styles.title, { color: Colors[ them ].text } ]}>
            Mesaj limitinə çatdınız
         </Text>
         <Text style={[ styles.description, { color: Colors[ them ].subtext } ]}>
            Limitsiz söhbət üçün VIP statusu əldə edin və bütün imkanlardan istifadə edin.
         </Text>
         <View style={styles.buttonWrapper}>
            <AnimatedButton
               style={{ ...styles.button, backgroundColor: Colors[ them ].primary }}
               onPress={onUpgrade}
               disabled={isPaying}
               haptic="medium"
            >
               {isPaying ? (
                  <ActivityIndicator color="#fff" size="small" />
               ) : (
                  <View style={styles.buttonContent}>
                     <Ionicons name="diamond" size={18} color="#fff" />
                     <Text style={styles.buttonText}>
                        VIP ol - {paymentAmount} AZN
                     </Text>
                  </View>
               )}
            </AnimatedButton>
         </View>
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
      marginBottom: 16,
      lineHeight: 20,
   },
   buttonWrapper: {
      width: '100%',
   },
   button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
   },
   buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
   },
} )
