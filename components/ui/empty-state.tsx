import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import LottieView from 'lottie-react-native'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { AnimatedButton } from './animated-button'

interface EmptyStateProps {
   title: string
   description?: string
   animation?: 'empty' | 'error' | 'search' | 'chat'
   actionLabel?: string
   onAction?: () => void
   style?: ViewStyle
}

const animations = {
   empty: require( '@/assets/lottie/empty.json' ),
   error: require( '@/assets/lottie/error.json' ),
   search: require( '@/assets/lottie/search.json' ),
   chat: require( '@/assets/lottie/chat.json' ),
}

export const EmptyState = ( {
   title,
   description,
   animation = 'empty',
   actionLabel,
   onAction,
   style,
}: EmptyStateProps ) => {
   const { them } = useMainContext()

   return (
      <View style={[ styles.container, style ]}>
         <LottieView
            source={animations[ animation ]}
            autoPlay
            loop
            style={styles.animation}
         />
         <Text style={[ styles.title, { color: Colors[ them ].text } ]}>{title}</Text>
         {description && (
            <Text style={[ styles.description, { color: Colors[ them ].subtext } ]}>
               {description}
            </Text>
         )}
         {actionLabel && onAction && (
            <AnimatedButton
               style={{ ...styles.button, backgroundColor: Colors[ them ].primary }}
               onPress={onAction}
               haptic="medium"
            >
               <Text style={styles.buttonText}>{actionLabel}</Text>
            </AnimatedButton>
         )}
      </View>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
   },
   animation: {
      width: 200,
      height: 200,
   },
   title: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 16,
   },
   description: {
      fontSize: 14,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 20,
   },
   button: {
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
      marginTop: 24,
   },
   buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },
} )
