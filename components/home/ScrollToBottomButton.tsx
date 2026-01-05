import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'

interface ScrollToBottomButtonProps {
   visible: boolean
   onPress: () => void
}

export const ScrollToBottomButton = ( { visible, onPress }: ScrollToBottomButtonProps ) => {
   if ( !visible ) return null

   return (
      <TouchableOpacity
         style={styles.button}
         onPress={onPress}
         activeOpacity={0.8}
      >
         <Ionicons name="chevron-down" size={20} color="#fff" />
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create( {
   button: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#111827',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
   },
} )
