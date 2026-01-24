import * as Haptics from 'expo-haptics'
import { useCallback, useRef } from 'react'
import {
   Animated,
   GestureResponderEvent,
   Pressable,
   PressableProps,
   StyleSheet,
   ViewStyle,
} from 'react-native'

interface AnimatedButtonProps extends Omit<PressableProps, 'style'> {
   style?: ViewStyle
   haptic?: 'light' | 'medium' | 'heavy' | 'none'
   scale?: number
   children: React.ReactNode
}

export const AnimatedButton = ( {
   style,
   haptic = 'light',
   scale = 0.97,
   children,
   onPress,
   disabled,
   ...props
}: AnimatedButtonProps ) => {
   const scaleAnim = useRef( new Animated.Value( 1 ) ).current

   const handlePressIn = useCallback( () => {
      Animated.spring( scaleAnim, {
         toValue: scale,
         useNativeDriver: true,
         speed: 50,
         bounciness: 4,
      } ).start()
   }, [ scaleAnim, scale ] )

   const handlePressOut = useCallback( () => {
      Animated.spring( scaleAnim, {
         toValue: 1,
         useNativeDriver: true,
         speed: 30,
         bounciness: 6,
      } ).start()
   }, [ scaleAnim ] )

   const handlePress = useCallback(
      ( event: GestureResponderEvent ) => {
         if ( haptic !== 'none' ) {
            const impact = {
               light: Haptics.ImpactFeedbackStyle.Light,
               medium: Haptics.ImpactFeedbackStyle.Medium,
               heavy: Haptics.ImpactFeedbackStyle.Heavy,
            }[ haptic ]
            Haptics.impactAsync( impact )
         }
         onPress?.( event )
      },
      [ haptic, onPress ]
   )

   return (
      <Pressable
         onPressIn={handlePressIn}
         onPressOut={handlePressOut}
         onPress={handlePress}
         disabled={disabled}
         {...props}
      >
         <Animated.View
            style={[
               style,
               styles.container,
               { transform: [ { scale: scaleAnim } ] },
               disabled && styles.disabled,
            ]}
         >
            {children}
         </Animated.View>
      </Pressable>
   )
}

const styles = StyleSheet.create( {
   container: {},
   disabled: {
      opacity: 0.6,
   },
} )
