import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import Toast from 'react-native-toast-message'

export default function DeepLinkRef() {
   const router = useRouter()
   const { code } = useLocalSearchParams()

   useEffect(() => {
      async function handleRef() {
         if (code) {
            await AsyncStorage.setItem('referralCode', code as string)
            Toast.show({ type: 'info', text1: 'Dəvət kodu saxlanıldı' })
         }
         // Kodu yadda saxladıqdan sonra qeydiyyat və ya giriş səhifəsinə yönləndiririk
         router.replace('/auth/register')
      }

      handleRef()
   }, [code, router])

   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <ActivityIndicator size="large" color="#0000ff" />
      </View>
   )
}
