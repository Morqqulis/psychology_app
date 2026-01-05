import { gradients } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { LinearGradient } from 'expo-linear-gradient'
import { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'

interface AuthFormContainerProps {
   children: ReactNode
   delay?: number
}

export const AuthFormContainer = ( { children, delay = 300 }: AuthFormContainerProps ) => {
   const { them } = useMainContext()

   return (
      <Animatable.View animation="fadeInUp" delay={delay} duration={1000}>
         <LinearGradient
            colors={gradients[ them ].glass}
            style={styles.formContainer}
         >
            {children}
         </LinearGradient>
      </Animatable.View>
   )
}

const styles = StyleSheet.create( {
   formContainer: {
      borderRadius: 20,
      padding: 24,
   },
} )
