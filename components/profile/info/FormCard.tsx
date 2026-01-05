import { GenderInput } from '@/components/reusable'
import { InputControlled } from "@/components/ui/input-controlled"
import { Colors } from "@/constants/theme"
import { useMainContext } from "@/providers/MainProvider"
import React, { useEffect, useRef, useState } from "react"
import { Control } from "react-hook-form"
import { Animated, StyleSheet } from "react-native"

interface IFormCardProps {
   type: "edit" | "view"
   control: Control<any>
}

export default function FormCard( { type, control }: IFormCardProps ) {
   const [ mounted, setMounted ] = useState( type === "edit" )
   const translateY = useRef( new Animated.Value( 50 ) ).current
   const opacity = useRef( new Animated.Value( 0 ) ).current
   const { them } = useMainContext()

   useEffect( () => {
      if ( type === "edit" ) setMounted( true )

      Animated.parallel( [
         Animated.timing( translateY, {
            toValue: type === "edit" ? 0 : 50,
            duration: 300,
            useNativeDriver: true,
         } ),
         Animated.timing( opacity, {
            toValue: type === "edit" ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
         } ),
      ] ).start( () => {
         if ( type === "view" ) setMounted( false )
      } )
   }, [ type ] )

   if ( !mounted ) return null

   return (
      <Animated.View
         style={[
            styles.formSection,
            {
               backgroundColor: Colors[ them ].surface,
               transform: [ { translateY } ],
               opacity,
            },
         ]}
      >
         <InputControlled
            control={control}
            name="name"
            label="Ad"
            placeholder="Adınızı daxil edin"
            leftIcon="person"
         />

         <InputControlled
            control={control}
            name="surname"
            label="Soyad"
            placeholder="Soyadınızı daxil edin"
            leftIcon="person-outline"
         />

         <InputControlled
            control={control}
            name="email"
            label="E-mail"
            placeholder="E-mail ünvanınızı daxil edin"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
         />

         <GenderInput
            control={control}
            name="gender"
            label="Cins"
            placeholder="Cinsinizi seçin"
         />
      </Animated.View>
   )
}

const styles = StyleSheet.create( {
   formSection: {
      padding: 20,
      borderRadius: 16,
      marginBottom: 30,
   },
} )
