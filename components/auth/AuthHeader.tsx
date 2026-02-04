import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'

interface AuthHeaderProps {
   icon: keyof typeof Ionicons.glyphMap
   title: string
   subtitle?: string
}

export const AuthHeader = ( { icon, title, subtitle }: AuthHeaderProps ) => {
   return (
      <Animatable.View
         animation="fadeInUp"
         duration={800}
         style={styles.headerContainer}
      >
         <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            iterationDelay={2000}
            duration={1500}
            style={styles.logoContainer}
         >
            <Ionicons name={icon} size={70} color="#fff" />
         </Animatable.View>
         <Animatable.Text animation="fadeIn" delay={300} style={styles.title}>
            {title}
         </Animatable.Text>
         {subtitle && (
            <Animatable.Text animation="fadeIn" delay={500} style={styles.subtitle}>
               {subtitle}
            </Animatable.Text>
         )}
      </Animatable.View>
   )
}

const styles = StyleSheet.create( {
   headerContainer: {
      alignItems: 'center',
      marginBottom: 40,
   },
   logoContainer: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      borderWidth: 2,
      borderColor: 'rgba(255, 255, 255, 0.2)',
   },
   title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: 0.5,
   },
   subtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
   },
} )
