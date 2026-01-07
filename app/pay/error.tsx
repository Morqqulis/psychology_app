import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function PaymentErrorScreen() {
   const router = useRouter()

   return (
      <View style={styles.container}>
         <Text style={styles.emoji}>❌</Text>
         <Text style={styles.title}>Ödəniş uğursuz oldu</Text>
         <Text style={styles.subtitle}>Zəhmət olmasa yenidən cəhd edin</Text>
         <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace( '/(tabs)/home' )}
         >
            <Text style={styles.buttonText}>Geri qayıt</Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      padding: 20,
   },
   emoji: {
      fontSize: 64,
      marginBottom: 20,
   },
   title: {
      fontSize: 22,
      fontWeight: '700',
      color: '#fff',
      textAlign: 'center',
      marginBottom: 8,
   },
   subtitle: {
      fontSize: 16,
      color: '#ef4444',
      textAlign: 'center',
      marginBottom: 24,
   },
   button: {
      backgroundColor: '#6366f1',
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
   },
   buttonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
   },
} )
