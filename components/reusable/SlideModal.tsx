import { Ionicons } from '@expo/vector-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
   Animated,
   Dimensions,
   Easing,
   Modal,
   StyleProp,
   StyleSheet,
   TouchableOpacity,
   TouchableWithoutFeedback,
   View,
   ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface SlideModalProps {
   visible: boolean
   onClose: () => void
   children: React.ReactNode
   direction?: 'left' | 'right' | 'top' | 'bottom'
   overlayStyle?: StyleProp<ViewStyle>
   viewStyle?: StyleProp<ViewStyle>
   distance?: number
   closeButton?: boolean
   closeButtonColor?: string
}

export default function SlideModal( {
   visible,
   onClose,
   distance = 100,
   children,
   direction = 'right',
   overlayStyle,
   viewStyle,
   closeButton = false,
   closeButtonColor = '#000',
}: SlideModalProps ) {
   const screen = Dimensions.get( 'window' )
   const translateAnim = useRef( new Animated.Value( 0 ) ).current
   const opacityAnim = useRef( new Animated.Value( 0 ) ).current
   const [ isMounted, setIsMounted ] = useState( visible )
   const modalSize = Math.min( Math.max( distance, 0 ), 100 ) / 100
   const insets = useSafeAreaInsets()

   const getInitialValue = useCallback( () => {
      switch ( direction ) {
         case 'left':
            return -screen.width * modalSize
         case 'right':
            return screen.width * modalSize
         case 'top':
            return -screen.height * modalSize
         case 'bottom':
            return screen.height * modalSize
         default:
            return screen.width * modalSize
      }
   }, [ direction, modalSize, screen.height, screen.width ] )

   useEffect( () => {
      const toValue = visible ? 0 : getInitialValue()
      const opacityTo = visible ? 1 : 0

      if ( visible ) {
         setIsMounted( true )
         translateAnim.setValue( getInitialValue() )
         opacityAnim.setValue( 0 )
      }

      Animated.parallel( [
         Animated.timing( translateAnim, {
            toValue,
            duration: visible ? 600 : 200,
            easing: Easing.out( Easing.poly( 4 ) ),
            useNativeDriver: true,
         } ),
         Animated.timing( opacityAnim, {
            toValue: opacityTo,
            duration: visible ? 600 : 200,
            useNativeDriver: true,
         } ),
      ] ).start( () => {
         if ( !visible ) {
            setIsMounted( false )
         }
      } )
   }, [ visible, direction, distance, translateAnim, getInitialValue, opacityAnim ] )

   const modalStyle: ViewStyle =
      direction === 'left' || direction === 'right'
         ? { width: `${modalSize * 100}%`, height: '100%' }
         : { height: `${modalSize * 100}%`, width: '100%' }

   const animatedStyle: ViewStyle =
      direction === 'left' || direction === 'right'
         ? { transform: [ { translateX: translateAnim } ] }
         : { transform: [ { translateY: translateAnim } ] }

   return (
      <Modal
         visible={isMounted}
         transparent
         animationType="none"
         onRequestClose={onClose}
         statusBarTranslucent
      >
         <View style={[ styles.overlay, overlayStyle ]}>
            <TouchableWithoutFeedback onPress={onClose}>
               <Animated.View style={[ styles.background, { opacity: opacityAnim } ]} />
            </TouchableWithoutFeedback>
            <Animated.View
               style={[
                  styles.modalContent,
                  modalStyle,
                  animatedStyle,
                  viewStyle,
                  { paddingTop: insets.top, paddingBottom: insets.bottom }
               ]}
            >
               {closeButton && (
                  <View style={styles.closeBtnContainer}>
                     <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="close" size={28} color={closeButtonColor} />
                     </TouchableOpacity>
                  </View>
               )}
               {children}
            </Animated.View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create( {
   closeBtnContainer: {
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      paddingTop: 10,
   },
   overlay: {
      flex: 1,
      justifyContent: 'flex-end',
   },
   background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
      backgroundColor: 'white',
      width: '100%',
      height: '100%',
   },
} )
