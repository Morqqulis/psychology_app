import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import * as Animatable from 'react-native-animatable'

import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'
import { gradients } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { useUserContext } from '@/providers/UserProvider'
import { Redirect, router } from 'expo-router'

export default function Index() {
   const { user, loading } = useUserContext()
   const { them } = useMainContext()

   if ( !loading && user?.id && user?.role === 'user' ) {
      return <Redirect href={'/(tabs)/home'} />
   }

   return (
      <LinearGradient colors={gradients[ them ].splash} style={styles.container}>
         <View style={styles.content}>
            <Animatable.View animation='fadeInDown' duration={1000} style={styles.headerContainer}>
               <View style={styles.iconContainer}>
                  {/* <Ionicons name='apps' size={80} color='#fff' /> */}
                  <Image
                     source={require( '@/assets/images/logo.png' )}
                     style={{ width: 200, height: 100 }}
                     resizeMode='contain'
                  />
               </View>
               <ThemedText style={[ styles.title, { color: '#fff' } ]}>Nur Yolu</ThemedText>
               <ThemedText style={[ styles.subtitle, { color: '#fff' } ]}>
                  Zehni sağlamlığınız bizim prioritetimizdir
               </ThemedText>
            </Animatable.View>

            <Animatable.View animation='fadeInUp' duration={1000} delay={300} style={styles.authContainer}>
               <Button title='Daxil ol' onPress={() => router.push( '/auth/login' )} variant='primary' loading={loading} />
               <Button
                  title='Qeydiyyat'
                  variant='outline'
                  onPress={() => router.push( '/auth/register' )}
                  style={[ styles.authButton, styles.outlineButton ]}
                  loading={loading}
               />
            </Animatable.View>

            <Animatable.View animation='fadeIn' duration={1000} delay={600} style={styles.featuresContainer}>
               <View style={styles.featureItem}>
                  <Ionicons name='shield-checkmark' size={24} color='#fff' />
                  <ThemedText style={[ styles.featureText ]}>Təhlükəsiz və məxfi</ThemedText>
               </View>
               <View style={styles.featureItem}>
                  <Ionicons name='people' size={24} color='#fff' />
                  <ThemedText style={[ styles.featureText ]}>Peşəkar psixoloqlar</ThemedText>
               </View>
               <View style={styles.featureItem}>
                  <Ionicons name='time' size={24} color='#fff' />
                  <ThemedText style={[ styles.featureText ]}>24/7 dəstək</ThemedText>
               </View>
            </Animatable.View>
         </View>
      </LinearGradient>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
   },

   content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
   },
   headerContainer: {
      alignItems: 'center',
      marginBottom: 50,
   },
   iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
   },
   title: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      lineHeight: 30,
   },
   subtitle: {
      fontSize: 16,
      textAlign: 'center',
      opacity: 0.9,
      paddingHorizontal: 20,
   },
   authContainer: {
      width: '100%',
      gap: 16,
      marginBottom: 40,
   },
   authButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
   },
   outlineButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: '#fff',
      borderWidth: 1,
   },
   featuresContainer: {
      width: '100%',
      gap: 16,
   },
   featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
   },
   featureText: {
      fontSize: 16,
      opacity: 0.9,
      color: '#fff',
   },
} )
