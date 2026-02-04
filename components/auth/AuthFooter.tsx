import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

interface AuthFooterProps {
   text: string
   linkText: string
   linkHref: '/auth/login' | '/auth/register'
}

export const AuthFooter = ( { text, linkText, linkHref }: AuthFooterProps ) => {
   const { them } = useMainContext()

   return (
      <View style={styles.footer}>
         <Text style={[ styles.footerText, { color: Colors[ them ].text } ]}>
            {text}
         </Text>
         <Link href={linkHref} asChild>
            <Text style={styles.linkText}>{linkText}</Text>
         </Link>
      </View>
   )
}

const styles = StyleSheet.create( {
   footer: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
   },
   footerText: {
      fontSize: 14,
   },
   linkText: {
      fontSize: 14,
      color: '#667eea',
      fontWeight: '600',
   },
} )
