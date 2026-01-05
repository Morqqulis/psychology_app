import { useEffect, useRef, useState } from 'react'
import {
   Animated,
   Dimensions,
   Easing,
   Modal,
   StyleProp,
   StyleSheet,
   TouchableWithoutFeedback,
   View,
   ViewStyle,
} from 'react-native'

interface SlideModalProps {
   visible: boolean
   onClose: () => void
   children: React.ReactNode
   direction?: 'left' | 'right' | 'top' | 'bottom'
   overlayStyle?: StyleProp<ViewStyle>
   viewStyle?: StyleProp<ViewStyle>
   distance?: number
}

export default function SlideModal( {
   visible,
   onClose,
   distance = 100,
   children,
   direction = 'right',
   overlayStyle,
   viewStyle,
}: SlideModalProps ) {
   const screen = Dimensions.get( 'window' )
   const translateAnim = useRef( new Animated.Value( 0 ) ).current
   const [ isMounted, setIsMounted ] = useState( visible )
   const modalSize = Math.min( Math.max( distance, 0 ), 100 ) / 100

   const getInitialValue = () => {
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
   }

   useEffect( () => {
      const toValue = visible ? 0 : getInitialValue()

      if ( visible ) {
         setIsMounted( true )
         translateAnim.setValue( getInitialValue() )
      }

      Animated.timing( translateAnim, {
         toValue,
         duration: visible ? 600 : 200,
         easing: Easing.out( Easing.poly( 4 ) ),
         useNativeDriver: true,
      } ).start( () => {
         if ( !visible ) {
            setIsMounted( false )
         }
      } )
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [ visible, direction, distance ] )

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
      >
         <View style={[ styles.overlay, overlayStyle ]}>
            <TouchableWithoutFeedback onPress={onClose}>
               <View style={styles.background} />
            </TouchableWithoutFeedback>
            <Animated.View
               style={[ styles.modalContent, modalStyle, animatedStyle, viewStyle ]}
            >
               {children}
            </Animated.View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create( {
   overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
   },
   modalContent: {
      backgroundColor: 'white',
      width: '100%',
      height: '100%',
   },
} )
