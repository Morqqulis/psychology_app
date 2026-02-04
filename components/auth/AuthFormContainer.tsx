import { gradients } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { LinearGradient } from 'expo-linear-gradient'
import { ReactNode, useRef } from 'react'
import { StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'

interface AuthFormContainerProps {
   children: ReactNode
   delay?: number
}

export const AuthFormContainer = ( { children, delay = 300 }: AuthFormContainerProps ) => {
   const { them } = useMainContext()
   const hasAnimated = useRef( false )

   const animation = hasAnimated.current ? undefined : 'fadeInUp'
   if ( !hasAnimated.current ) hasAnimated.current = true

   return (
      <Animatable.View animation={animation} delay={delay} duration={800} useNativeDriver>
         <LinearGradient
            colors={gradients[ them ].glass}
            style={styles.formContainer}
         >
            {children}
         </LinearGradient>
      </Animatable.View >
   )
}

const styles = StyleSheet.create( {
   formContainer: {
      borderRadius: 20,
      padding: 24,
   },
} )
