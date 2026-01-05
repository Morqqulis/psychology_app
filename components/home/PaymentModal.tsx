import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { Ionicons } from '@expo/vector-icons'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface PaymentModalProps {
   visible: boolean
   onClose: () => void
   isVip: boolean
   isPaying: boolean
   remaining: number
   onUpgrade: () => void
}

export const PaymentModal = ( {
   visible,
   onClose,
   isVip,
   isPaying,
   remaining,
   onUpgrade,
}: PaymentModalProps ) => {
   const { them } = useMainContext()

   return (
      <Modal
         visible={visible}
         transparent
         animationType="fade"
         onRequestClose={onClose}
      >
         <Pressable style={styles.backdrop} onPress={onClose}>
            <Pressable
               style={[ styles.card, { backgroundColor: Colors[ them ].surface } ]}
               onPress={() => { }}
            >
               <View style={styles.header}>
                  <Text style={[ styles.title, { color: Colors[ them ].text } ]}>Limitsiz AI</Text>
                  <TouchableOpacity
                     onPress={onClose}
                     hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                     <Ionicons name="close" size={20} color={Colors[ them ].icon} />
                  </TouchableOpacity>
               </View>
               <Text style={styles.text}>
                  {isVip
                     ? 'Hesabınız VIP-dır, məhdudiyyət yoxdur.'
                     : `Hazırda ${remaining} mesaj qalıb. Limitsiz istifadə üçün 5 AZN ödəniş edin və yazışmanı davam etdirin.`}
               </Text>
               <TouchableOpacity
                  style={[ styles.button, { backgroundColor: Colors[ them ].primary } ]}
                  activeOpacity={0.9}
                  onPress={async () => {
                     if ( isPaying || isVip ) return
                     onClose()
                     await onUpgrade()
                  }}
                  disabled={isVip}
               >
                  <Text style={styles.buttonText}>
                     {isVip ? 'VIP aktivdir' : isPaying ? 'Gözləyin...' : 'Ödəmək 5 AZN'}
                  </Text>
                  {!isVip && <Ionicons name="arrow-forward" size={16} color="#fff" />}
               </TouchableOpacity>
            </Pressable>
         </Pressable>
      </Modal>
   )
}

const styles = StyleSheet.create( {
   backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
   },
   card: {
      width: '100%',
      borderRadius: 16,
      padding: 18,
      gap: 12,
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   title: {
      fontSize: 18,
      fontWeight: '700',
   },
   text: {
      fontSize: 14,
      color: '#ccc',
      lineHeight: 20,
   },
   button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: 12,
   },
   buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
   },
} )
