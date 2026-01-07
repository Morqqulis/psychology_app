import { useProfile } from '@/services/auth/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function PaymentSuccessScreen() {
   const router = useRouter()
   const queryClient = useQueryClient()
   const { refetch } = useProfile()

   useEffect( () => {
      const refreshAndRedirect = async () => {
         await queryClient.invalidateQueries( { queryKey: [ 'profile' ] } )
         await refetch()
         setTimeout( () => {
            router.replace( '/(tabs)/home' )
         }, 2000 )
      }
      refreshAndRedirect()
   }, [ queryClient, refetch, router ] )

   return (
      <View style={styles.container}>
         <Text style={styles.emoji}>✅</Text>
         <Text style={styles.title}>Ödəniş uğurla tamamlandı!</Text>
         <Text style={styles.subtitle}>VIP statusunuz aktivləşdirildi</Text>
         <Text style={styles.redirect}>Yönləndirilirsiniz...</Text>
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
      color: '#10b981',
      textAlign: 'center',
      marginBottom: 24,
   },
   redirect: {
      fontSize: 14,
      color: '#888',
   },
} )
