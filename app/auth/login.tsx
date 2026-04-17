import { AuthFooter, AuthFormContainer, AuthHeader } from '@/components/auth'
import { Button } from '@/components/ui/button'
import { InputControlled } from '@/components/ui/input-controlled'
import { gradients } from '@/constants/theme'
import { addCookie } from '@/functions/cookieActions'
import { showToast } from '@/hooks/useToast'
import { useMainContext } from '@/providers/MainProvider'
import { useUserContext } from '@/providers/UserProvider'
import { getAuthErrorMessage, useLogin } from '@/services/auth/auth'
import { LoginFormData, loginSchema } from '@/shared/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
   KeyboardAvoidingView,
   ScrollView,
   StyleSheet,
   View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function LoginScreen() {
   const { them } = useMainContext()
   const { setUser } = useUserContext()
   const { bottom } = useSafeAreaInsets()
   const { control, handleSubmit } = useForm<LoginFormData>( {
      resolver: zodResolver( loginSchema ),
      defaultValues: {
         email: "",
         password: "",
      },
      shouldFocusError: false,
   } )

   const loginMutation = useLogin()

   const onSubmit = ( data: LoginFormData ) => {

      loginMutation.mutate( data, {
         onSuccess: async ( data ) => {
            await addCookie( "token", data.token )
            setUser( data.user )
            showToast( {
               title: "Uğurlu",
               message: "Hesaba uğurla daxil oldunuz!",
               type: "success",
            } )
            router.replace( "/(tabs)/home" )
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

   return (
      <View style={styles.container}>
         <LinearGradient colors={gradients[ them ].splash} style={[ styles.gradient, { paddingBottom: bottom } ]}>
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
               <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
               >
                  <AuthHeader icon="person-circle-outline" title="Xoş gəlmişsiniz" subtitle="Hesabınıza daxil olun" />

                  <AuthFormContainer>
                     <InputControlled
                        control={control}
                        name="email"
                        label="Email"
                        placeholder="Email ünvanınızı daxil edin"
                        keyboardType="email-address"
                        leftIcon="mail-outline"
                        variant="primary"
                     />
                     <InputControlled
                        control={control}
                        name="password"
                        label="Şifrə"
                        placeholder="Şifrənizi daxil edin"
                        autoComplete="current-password"
                        leftIcon="lock-closed-outline"
                        variant="primary"
                     />

                     <Button
                        title="Daxil ol"
                        onPress={handleSubmit( onSubmit )}
                        loading={loginMutation.isPending}
                        style={styles.loginButton}
                     />

                     <AuthFooter
                        text="Hesabınız yoxdur?"
                        linkText="Qeydiyyatdan keç"
                        linkHref="/auth/register"
                     />
                  </AuthFormContainer>
               </ScrollView>
            </KeyboardAvoidingView>
         </LinearGradient>
      </View>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
   },
   gradient: {
      flex: 1,
   },
   scrollContent: {
      flexGrow: 1,
      padding: 20,
      paddingTop: 80,
      paddingBottom: 40,
   },
   loginButton: {
      marginTop: 8,
   },
} )
