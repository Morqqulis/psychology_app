import { Colors, gradients } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { useCallback, useRef } from 'react'
import {
   ActivityIndicator,
   Animated,
   GestureResponderEvent,
   Pressable,
   StyleProp,
   StyleSheet,
   Text,
   ViewStyle,
} from 'react-native'

interface ButtonProps {
   title: string
   variant?: 'primary' | 'secondary' | 'outline'
   size?: 'small' | 'medium' | 'large'
   loading?: boolean
   leftIcon?: React.ReactNode
   rightIcon?: React.ReactNode
   disabled?: boolean
   style?: StyleProp<ViewStyle>
   onPress?: ( event: GestureResponderEvent ) => void
   haptic?: 'light' | 'medium' | 'heavy' | 'none'
   textStyle?: StyleProp<ViewStyle> | any
}

export const Button = ( {
   title,
   variant = 'primary',
   size = 'medium',
   loading = false,
   leftIcon,
   rightIcon,
   disabled,
   style,
   onPress,
   haptic = 'light',
   textStyle
}: ButtonProps ) => {
   const { them } = useMainContext()
   const scaleAnim = useRef( new Animated.Value( 1 ) ).current

   const getButtonHeight = () => {
      switch ( size ) {
         case 'small':
            return 40
         case 'large':
            return 60
         default:
            return 50
      }
   }

   const getFontSize = () => {
      switch ( size ) {
         case 'small':
            return 14
         case 'large':
            return 18
         default:
            return 16
      }
   }

   const handlePressIn = useCallback( () => {
      Animated.spring( scaleAnim, {
         toValue: 0.97,
         useNativeDriver: true,
         speed: 50,
         bounciness: 4,
      } ).start()
   }, [ scaleAnim ] )

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

   const isDisabled = disabled || loading
   const color = Colors[ them ][ variant ]

   const renderContent = () => (
      <>
         {loading ? (
            <ActivityIndicator color={variant === 'primary' ? '#fff' : color} size="small" />
         ) : (
            <Text
               style={[
                  styles.buttonText,
                  { fontSize: getFontSize() },
                  variant !== 'primary' && { color },
                  textStyle
               ]}
            >
               {title}
            </Text>
         )}
         {rightIcon && !loading && rightIcon}
      </>
   )

   if ( variant === 'primary' ) {
      return (
         <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={isDisabled}
         >
            <Animated.View
               style={[
                  styles.button,
                  { height: getButtonHeight(), transform: [ { scale: scaleAnim } ] },
                  isDisabled && styles.disabled,
                  style,
               ]}
            >
               <LinearGradient
                  colors={gradients[ them ].btnContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[ styles.gradient, { borderRadius: 12 } ]}
               >
                  {renderContent()}
               </LinearGradient>
            </Animated.View>
         </Pressable>
      )
   }

   return (
      <Pressable
         onPressIn={handlePressIn}
         onPressOut={handlePressOut}
         onPress={handlePress}
         disabled={isDisabled}
      >
         <Animated.View
            style={[
               styles.button,
               {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 24,
                  height: getButtonHeight(),
                  transform: [ { scale: scaleAnim } ],
                  backgroundColor:
                     variant === 'secondary'
                        ? them === 'dark'
                           ? '#2a2a2a'
                           : '#f8f9fa'
                        : 'transparent',
                  borderWidth: variant === 'outline' ? 1 : 0,
                  borderColor: them === 'dark' ? '#404040' : '#e9ecef',
               },
               isDisabled && styles.disabled,
               style,
            ]}
         >
            {renderContent()}
         </Animated.View>
      </Pressable>
   )
}

const styles = StyleSheet.create( {
   button: {
      borderRadius: 12,
      marginVertical: 8,
      overflow: 'hidden',
   },
   gradient: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
   },
   buttonText: {
      fontWeight: '600',
      textAlign: 'center',
      color: '#fff',
      marginHorizontal: 8,
   },
   disabled: {
      opacity: 0.6,
   },
} )
