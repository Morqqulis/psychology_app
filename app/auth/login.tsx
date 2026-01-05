import { AuthFooter, AuthFormContainer, AuthHeader } from '@/components/auth'
import { Button } from '@/components/ui/button'
import { InputControlled } from '@/components/ui/input-controlled'
import { Colors, gradients } from '@/constants/theme'
import { addCookie } from '@/functions/cookieActions'
import { showToast } from '@/hooks/useToast'
import { useMainContext } from '@/providers/MainProvider'
import { useUserContext } from '@/providers/UserProvider'
import { useLogin } from '@/services/auth/auth'
import { LoginFormData, loginSchema } from '@/shared/schemas/auth'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React from 'react'
import { useForm } from 'react-hook-form'
import {
   KeyboardAvoidingView,
   Platform,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from 'react-native'

export default function LoginScreen() {
   const { them } = useMainContext()
   const { setUser } = useUserContext()
   const { control, handleSubmit } = useForm<LoginFormData>( {
      resolver: zodResolver( loginSchema ),
      defaultValues: {
         email: "test@test.test",
         password: "Salam123",
         // email: undefined,
         // password: undefined,
      },
   } )

   const loginMutation = useLogin()

   const onSubmit = ( data: LoginFormData ) => {
      loginMutation.mutate( data, {
         onSuccess: async ( data ) => {
            const { token, user } = data
            await addCookie( "token", token )
            setUser( {
               id: user.id,
               name: user.name,
               role: user.role,
               surname: user.surname,
               gender: user.gender,
               updatedAt: user.updatedAt,
               createdAt: user.createdAt,
               email: user.email,
            } )
            showToast( {
               title: "Uğurlu",
               message: "Hesaba uğurla daxil oldunuz!",
               type: "success",
            } )
            router.replace( "/(tabs)/home" )
         },
         onError: ( error: any ) => {
            console.log( "Login error: ", error )

            showToast( {
               title: "Xəta",
               message: "Email və ya parol yanlışdır",
               type: "error",
            } )
         },
      } )
   }

   return (
      <KeyboardAvoidingView
         style={styles.container}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
         <LinearGradient colors={gradients[ them ].splash} style={styles.gradient}>
            <ScrollView
               contentContainerStyle={styles.scrollContent}
               showsVerticalScrollIndicator={false}
            >
               <AuthHeader icon="person-circle-outline" title="Xoş gəlmişsiniz" />

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

                  <View style={styles.divider}>
                     <View style={styles.dividerLine} />
                     <Text style={[ styles.dividerText, { color: Colors[ them ].text } ]}>
                        və ya
                     </Text>
                     <View style={styles.dividerLine} />
                  </View>

                  <Button
                     title="Google ilə daxil ol"
                     variant="outline"
                     leftIcon={<Ionicons name="logo-google" size={20} color="#667eea" />}
                     style={styles.socialButton}
                  />

                  <AuthFooter
                     text="Hesabınız yoxdur?"
                     linkText="Qeydiyyatdan keç"
                     linkHref="/auth/register"
                  />
               </AuthFormContainer>
            </ScrollView>
         </LinearGradient>
      </KeyboardAvoidingView>
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
      justifyContent: 'center',
      padding: 20,
      paddingVertical: 50,
   },
   loginButton: {
      marginTop: 8,
   },
   divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
   },
   dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#ECEDEE',
   },
   dividerText: {
      marginHorizontal: 16,
      fontSize: 14,
   },
   socialButton: {
      marginBottom: 24,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      borderColor: '#fff',
      borderWidth: 0.5,
   },
} )
