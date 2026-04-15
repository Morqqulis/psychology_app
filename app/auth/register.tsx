import { AuthFooter, AuthFormContainer, AuthHeader } from '@/components/auth'
import { GenderInput } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { InputControlled } from '@/components/ui/input-controlled'
import { Colors, gradients } from '@/constants/theme'
import { showToast } from '@/hooks/useToast'
import { useMainContext } from '@/providers/MainProvider'
import { getAuthErrorMessage, useRegister } from '@/services/auth/auth'
import { RegisterFormData, registerSchema } from '@/shared/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   Text,
   View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function RegisterScreen() {
   const { them } = useMainContext()
   const [ referralCode, setReferralCode ] = useState<string | undefined>()
   const { top } = useSafeAreaInsets()

   const { control, handleSubmit } = useForm<RegisterFormData>( {
      resolver: zodResolver( registerSchema ),
      defaultValues: {
         name: undefined,
         surname: undefined,
         email: undefined,
         password: undefined,
         confirmPassword: undefined,
         gender: undefined,
      },
      shouldFocusError: false,
   } )

   const registerMutation = useRegister()

   const onSubmit = ( data: RegisterFormData ) => {
      registerMutation.mutate( { ...data, referredBy: referralCode }, {
         onSuccess: () => {
            showToast( {
               title: "Uğurlu",
               message: "Hesab uğurla yaradıldı!",
               type: "success",
            } )
            router.replace( "/auth/login" )
         },
         onError: ( error ) => {
            showToast( {
               title: "Xəta",
               message: getAuthErrorMessage( error ),
               type: "error",
            } )
         },
      } )
   }

   useEffect( () => {
      AsyncStorage.getItem( "referralCode" ).then( ( code ) => {
         if ( code ) {
            setReferralCode( code )
         }
      } )
   }, [] )

   return (
      <View style={styles.container}>
         <LinearGradient colors={gradients[ them ].splash} style={[ styles.gradient, { paddingTop: top } ]}>
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
               <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
               >

                  <AuthHeader icon="person-add" title="Hesab yarat" subtitle="Yeni bir səyahətə başla" />

                  <AuthFormContainer>
                     <InputControlled
                        control={control}
                        name="name"
                        label="Ad"
                        placeholder="Adınızı daxil edin"
                        leftIcon="person-outline"
                        variant="primary"
                        autoCapitalize="words"
                     />

                     <InputControlled
                        control={control}
                        name="surname"
                        label="Soyad"
                        placeholder="Soyadınızı daxil edin"
                        variant="primary"
                        leftIcon="person-outline"
                        autoCapitalize="words"
                     />

                     <InputControlled
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="Email ünvanınızı daxil edin"
                        variant="primary"
                        leftIcon="mail-outline"
                        keyboardType="email-address"
                     />

                     <GenderInput
                        control={control}
                        name="gender"
                        label="Cinsiyyət"
                        variant="primary"
                        placeholder="Cinsinizi seçin"
                     />
                     <InputControlled
                        control={control}
                        name="password"
                        label="Şifrə"
                        variant="primary"
                        placeholder="Şifrənizi daxil edin"
                        autoComplete="password"
                        leftIcon="lock-closed-outline"
                     />
                     <InputControlled
                        control={control}
                        name="confirmPassword"
                        label="Şifrəni təsdiq edin"
                        placeholder="Şifrənizi təkrar daxil edin"
                        autoComplete="password"
                        leftIcon="lock-closed-outline"
                        variant="primary"
                     />

                     <Text style={[ styles.passwordHint, { color: Colors[ them ].text } ]}>
                        Şifrə ən azı 8 simvol, böyük və kiçik hərflər, rəqəmlər ehtiva
                        etməlidir
                     </Text>

                     <Button
                        title="Hesab yarat"
                        onPress={handleSubmit( onSubmit )}
                        loading={registerMutation.isPending}
                        style={styles.registerButton}
                     />

                     <AuthFooter
                        text="Artıq hesabınız var?"
                        linkText="Daxil ol"
                        linkHref="/auth/login"
                     />
                  </AuthFormContainer>
               </ScrollView>
            </KeyboardAvoidingView>
         </LinearGradient>
      </View >
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
      // paddingTop: 50,
      // backgroundColor: 'red',

   },
   gradient: {
      flex: 1,
   },
   scrollContent: {
      flexGrow: 1,
      paddingVertical: 50,
      paddingTop: 80,
      padding: 10,
      overflow: 'scroll',
   },
   passwordHint: {
      fontSize: 12,
      marginBottom: 16,
      lineHeight: 16,
   },
   registerButton: {
      marginTop: 8,
   },
} )
