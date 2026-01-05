import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable'

interface AuthHeaderProps {
   icon: keyof typeof Ionicons.glyphMap
   title: string
}

export const AuthHeader = ( { icon, title }: AuthHeaderProps ) => {
   return (
      <Animatable.View
         animation="fadeInUp"
         duration={1000}
         style={styles.headerContainer}
      >
         <View style={styles.logoContainer}>
            <Ionicons name={icon} size={80} color="#fff" />
         </View>
         <Text style={styles.title}>{title}</Text>
      </Animatable.View>
   )
}

const styles = StyleSheet.create( {
   headerContainer: {
      alignItems: 'center',
      marginBottom: 40,
   },
   logoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
   },
   title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
      textAlign: 'center',
   },
} )
