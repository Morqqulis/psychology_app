import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, ViewStyle } from 'react-native'

interface SkeletonProps {
   width: number
   height: number
   borderRadius?: number
   style?: ViewStyle
}

export const Skeleton = ( { width, height, borderRadius = 8, style }: SkeletonProps ) => {
   const { them } = useMainContext()
   const opacity = useRef( new Animated.Value( 0.3 ) ).current

   useEffect( () => {
      const animation = Animated.loop(
         Animated.sequence( [
            Animated.timing( opacity, {
               toValue: 0.7,
               duration: 800,
               useNativeDriver: true,
            } ),
            Animated.timing( opacity, {
               toValue: 0.3,
               duration: 800,
               useNativeDriver: true,
            } ),
         ] )
      )
      animation.start()
      return () => animation.stop()
   }, [ opacity ] )

   return (
      <Animated.View
         style={[
            {
               width,
               height,
               borderRadius,
               backgroundColor: Colors[ them ].surface,
               opacity,
            },
            style,
         ]}
      />
   )
}

export const ProfileSkeleton = () => {
   const { them } = useMainContext()

   return (
      <View style={[ styles.profileContainer, { backgroundColor: Colors[ them ].background } ]}>
         <View style={styles.header}>
            <Skeleton width={80} height={80} borderRadius={40} />
            <View style={styles.headerText}>
               <Skeleton width={150} height={20} />
               <Skeleton width={200} height={14} style={{ marginTop: 8 }} />
            </View>
         </View>
         <View style={styles.stats}>
            <View style={styles.statItem}>
               <Skeleton width={90} height={60} borderRadius={12} />
            </View>
            <View style={styles.statItem}>
               <Skeleton width={90} height={60} borderRadius={12} />
            </View>
            <View style={styles.statItem}>
               <Skeleton width={90} height={60} borderRadius={12} />
            </View>
         </View>
         <View style={{ marginTop: 16 }}>
            <Skeleton width={300} height={50} borderRadius={12} />
         </View>
         <View style={{ marginTop: 12 }}>
            <Skeleton width={300} height={50} borderRadius={12} />
         </View>
      </View>
   )
}

export const ChatSkeleton = () => {
   return (
      <View style={styles.chatContainer}>
         <View style={styles.messageRow}>
            <Skeleton width={240} height={60} borderRadius={16} />
         </View>
         <View style={[ styles.messageRow, styles.userRow ]}>
            <Skeleton width={200} height={45} borderRadius={16} />
         </View>
         <View style={styles.messageRow}>
            <Skeleton width={280} height={80} borderRadius={16} />
         </View>
         <View style={[ styles.messageRow, styles.userRow ]}>
            <Skeleton width={180} height={40} borderRadius={16} />
         </View>
      </View>
   )
}

const styles = StyleSheet.create( {
   profileContainer: {
      padding: 16,
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
   },
   headerText: {
      flex: 1,
   },
   stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
   },
   statItem: {
      flex: 1,
      marginHorizontal: 4,
   },
   chatContainer: {
      padding: 16,
      gap: 16,
      flex: 1,
   },
   messageRow: {
      alignItems: 'flex-start',
   },
   userRow: {
      alignItems: 'flex-end',
   },
} )
