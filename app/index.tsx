import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import { Redirect, router } from 'expo-router'
import React, { useRef } from 'react'
import {
   Animated,
   Dimensions,
   FlatList,
   StyleSheet,
   View
} from 'react-native'
import * as Animatable from 'react-native-animatable'

import { OnboardingSlide, SLIDES } from '@/components/onboarding/OnboardingSlide'
import { Button } from '@/components/ui/button'
import { ThemedText } from '@/components/ui/themed-text'
import { gradients } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { useUserContext } from '@/providers/UserProvider'

const { width } = Dimensions.get( 'window' )

export default function Index() {
   const { user, loading: userLoading } = useUserContext()
   const { them } = useMainContext()

   const scrollX = useRef( new Animated.Value( 0 ) ).current
   const slidesRef = useRef<FlatList>( null )

   // State for Autoplay & Haptics
   const [ , setCurrentIndex ] = React.useState( 0 )
   const autoplayTimer = useRef<any>( null )

   const viewableItemsChanged = useRef( ( { viewableItems }: any ) => {
      const newIndex = viewableItems[ 0 ]?.index ?? 0
      setCurrentIndex( ( prev ) => {
         if ( prev !== newIndex ) {
            Haptics.selectionAsync()
         }
         return newIndex
      } )
   } ).current

   const viewConfig = useRef( { viewAreaCoveragePercentThreshold: 50 } ).current

   // --- AUTO PLAY LOGIC ---
   const stopAutoplay = React.useCallback( () => {
      if ( autoplayTimer.current ) {
         clearInterval( autoplayTimer.current )
         autoplayTimer.current = null
      }
   }, [] )

   const startAutoplay = React.useCallback( () => {
      stopAutoplay()
      autoplayTimer.current = setInterval( () => {
         setCurrentIndex( ( prev ) => {
            const nextIndex = prev + 1
            if ( nextIndex < SLIDES.length ) {
               slidesRef.current?.scrollToIndex( { index: nextIndex, animated: true } )
               return nextIndex
            } else {
               stopAutoplay()
               return prev
            }
         } )
      }, 4000 )
   }, [ stopAutoplay ] )

   React.useEffect( () => {
      startAutoplay()
      return () => stopAutoplay()
   }, [ startAutoplay, stopAutoplay ] )

   // 1. Session check - highest priority: if logged in, go to home
   if ( !userLoading && user?.id && user?.role === 'user' ) {
      return <Redirect href={'/(tabs)/home'} />
   }

   // 2. Loading state checking session
   if ( userLoading ) {
      return (
         <LinearGradient colors={gradients[ them ].splash} style={styles.container}>
            <View style={styles.center}>
               <ThemedText style={{ color: '#fff' }}>Yüklənir...</ThemedText>
            </View>
         </LinearGradient>
      )
   }



   // --- ONBOARDING CAROUSEL RENDER ---

   const Indicator = () => {
      return (
         <View style={styles.indicatorContainer}>
            {SLIDES.map( ( _, i ) => {
               const inputRange = [ ( i - 1 ) * width, i * width, ( i + 1 ) * width ]
               const dotWidth = scrollX.interpolate( {
                  inputRange,
                  outputRange: [ 10, 20, 10 ],
                  extrapolate: 'clamp',
               } )
               const opacity = scrollX.interpolate( {
                  inputRange,
                  outputRange: [ 0.3, 1, 0.3 ],
                  extrapolate: 'clamp',
               } )
               return (
                  <Animated.View
                     style={[ styles.dot, { width: dotWidth, opacity } ]}
                     key={i.toString()}
                  />
               )
            } )}
         </View>
      )
   }

   return (
      <LinearGradient colors={gradients[ them ].splash} style={styles.container}>
         <View style={{ flex: 1, marginTop: 40 }}>
            <FlatList
               data={SLIDES}
               renderItem={( { item } ) => <OnboardingSlide item={item} />}
               horizontal
               showsHorizontalScrollIndicator={false}
               pagingEnabled
               bounces={false}
               keyExtractor={( item ) => item.id}
               onScroll={Animated.event( [ { nativeEvent: { contentOffset: { x: scrollX } } } ], {
                  useNativeDriver: false,
               } )}
               onScrollBeginDrag={stopAutoplay}
               scrollEventThrottle={32}
               onViewableItemsChanged={viewableItemsChanged}
               viewabilityConfig={viewConfig}
               ref={slidesRef}
            />
         </View>

         <View style={styles.bottomContainer}>
            <Indicator />
            <Animatable.View animation='fadeInUp' duration={1000} delay={300} style={styles.authWrapper}>
               <BlurView intensity={30} tint="dark" style={styles.authContainer}>
                  <Button
                     title='Daxil ol'
                     onPress={() => {
                        Haptics.impactAsync( Haptics.ImpactFeedbackStyle.Light )
                        router.push( '/auth/login' )
                     }}
                     variant='primary'
                  />
                  <Button
                     title='Qeydiyyat'
                     variant='outline'
                     onPress={() => {
                        Haptics.impactAsync( Haptics.ImpactFeedbackStyle.Light )
                        router.push( '/auth/register' )
                     }}
                     style={[ styles.authButton, styles.outlineButton ]}
                     textStyle={{ color: '#fff' }}
                  />
               </BlurView>
            </Animatable.View>
         </View>
      </LinearGradient>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
   },
   center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   },
   content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
   },
   headerContainer: {
      alignItems: 'center',
      marginBottom: 50,
   },
   iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
   },
   title: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      lineHeight: 30,
   },
   subtitle: {
      fontSize: 16,
      textAlign: 'center',
      opacity: 0.9,
      paddingHorizontal: 20,
   },
   authWrapper: {
      width: '100%',
      marginBottom: 40,
      borderRadius: 20,
      overflow: 'hidden',
   },
   authContainer: {
      width: '100%',
      padding: 20,
      gap: 8,
      backgroundColor: 'rgba(0,0,0,0.1)', // Subtle tint for Glassmorphism
   },
   authButton: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
   },
   outlineButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)', // slightly more visible
      borderWidth: 1, // Restore border so it's visible as a button
      borderColor: 'rgba(255, 255, 255, 0.3)',
   },
   // Onboarding Styles
   skipContainer: {
      marginTop: 60,
      paddingHorizontal: 20,
      alignItems: 'flex-end',
   },
   skipText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      opacity: 0.8
   },
   bottomContainer: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 40,
   },
   indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 30,
   },
   dot: {
      height: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
      marginHorizontal: 8,
   },
   nextButton: {
      backgroundColor: '#fff',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: '80%',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
   },
   nextButtonText: {
      color: '#1a1a1a',
      fontSize: 18,
      fontWeight: 'bold',
   }
} )
