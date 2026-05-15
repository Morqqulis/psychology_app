import { Colors } from "@/constants/theme"
import { showToast } from "@/hooks/useToast"
import { useMainContext } from "@/providers/MainProvider"
import { useUserContext } from "@/providers/UserProvider"
import { useProfile } from "@/services/auth/auth"
import { useUpdateProfile } from "@/services/auth/user"
import { EditProfileFormData, editProfileSchema } from "@/shared/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { RefreshControl, StyleSheet, Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useQueryClient } from "@tanstack/react-query"
import FormCard from "./FormCard"
import InfoCard from "./InfoCard"

export default function ProfileInfo() {
   const { them } = useMainContext()
   const { bottom: safeBottom } = useSafeAreaInsets()
   const { user, setUser } = useUserContext()
   const [ type, setType ] = useState<"view" | "edit">( "view" )
   const [ loading, setLoading ] = useState( false )
   const [ isRefreshing, setIsRefreshing ] = useState( false )
   const updateProfile = useUpdateProfile()
   const { refetch, isRefetching } = useProfile()
   const queryClient = useQueryClient()

   const defaultValues = user
      ? {
         name: user.name,
         surname: user.surname,
         email: user.email,
         gender: user.gender,
      }
      : undefined

   const { control, handleSubmit, reset } = useForm<EditProfileFormData>( {
      resolver: zodResolver( editProfileSchema ),
      defaultValues,
   } )

   const onSubmit = ( data: EditProfileFormData ) => {
      if ( !user ) return
      setLoading( true )
      updateProfile.mutate(
         { id: user.id, userData: data },
         {
            onSuccess: ( updatedUser ) => {
               setUser( updatedUser.doc )
               reset( {
                  name: updatedUser.doc.name,
                  surname: updatedUser.doc.surname,
                  email: updatedUser.doc.email,
                  gender: updatedUser.doc.gender,
               } )
               setLoading( false )
               showToast( {
                  message: "",
                  title: "Məlumatlarınız yeniləndi",
                  type: "success",
               } )
               setType( "view" )
            },
            onError: ( err: unknown ) => {
               console.log( err )
               showToast( {
                  title: "Xəta",
                  message: "Məlumatlarınız yenilənmədi",
                  type: "error",
               } )
               setLoading( false )
            },
         }
      )
   }

   const handleCancel = () => {
      reset( defaultValues )
      setType( "view" )
   }

   const handleRefresh = async () => {
      setIsRefreshing( true )
      try {
         await Promise.allSettled( [
            refetch(),
            queryClient.invalidateQueries( {
               queryKey: [ "chat", "meta", user?.id ],
               refetchType: 'active',
            } ),
            queryClient.invalidateQueries( {
               queryKey: [ "settings" ],
               refetchType: 'active',
            } ),
         ] )
      } finally {
         setIsRefreshing( false )
      }
   }

   if ( !user ) {
      return (
         <View
            style={[ styles.scroll, { backgroundColor: Colors[ them ].background } ]}
         >
            <Text style={[ styles.emptyText, { color: Colors[ them ].text } ]}>
               İstifadəçi məlumatları tapılmadı
            </Text>
         </View>
      )
   }

   return (
      <KeyboardAwareScrollView
         style={[ styles.scroll, { backgroundColor: Colors[ them ].background } ]}
         contentContainerStyle={styles.content}
         showsVerticalScrollIndicator={false}
         keyboardShouldPersistTaps="handled"
         keyboardDismissMode="interactive"
         bottomOffset={safeBottom + 32}
         extraKeyboardSpace={24}
         refreshControl={
            <RefreshControl
               refreshing={isRefetching || isRefreshing}
               onRefresh={handleRefresh}
               tintColor={Colors[ them ].primary}
               colors={[ Colors[ them ].primary ]}
            />
         }
      >
         <InfoCard
            handleCancel={handleCancel}
            type={type}
            setType={setType}
            handleSubmit={handleSubmit( onSubmit )}
            loading={loading}
         />
         <FormCard type={type} control={control} />
      </KeyboardAwareScrollView>
   )
}

const styles = StyleSheet.create( {
   scroll: {
      flex: 1,
   },
   content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
      flexGrow: 1,
   },
   emptyText: {
      fontSize: 18,
      textAlign: "center",
      marginTop: 50,
   },
} )
