import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { Specialist } from '@/services/specialists/specialists'
import { getImageUrl } from '@/shared/utils/image'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const CARD_HEIGHT = 480

interface Props {
   specialist: Specialist
}

export const SpecialistCard: React.FC<Props> = ( { specialist } ) => {
   const { them } = useMainContext()
   const isDark = them === 'dark'
   const imageUrl = getImageUrl( specialist.image )

   return (
      <View style={styles.outerContainer}>
         <Link href={`/specialists/${specialist.id}`} asChild>
            <TouchableOpacity activeOpacity={0.9} style={styles.touchable}>
               <View style={[ styles.inner, { backgroundColor: isDark ? '#1f2937' : '#e5e7eb' } ]}>

                  {/* Image is absolutely positioned but constrained by the fixed-height 'inner' view */}
                  {imageUrl ? (
                     <Image
                        source={{ uri: imageUrl }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        contentPosition="top center"
                        transition={500}
                     />
                  ) : (
                     <View style={styles.placeholder}>
                        <Ionicons name="person" size={100} color={Colors[ them ].icon} />
                     </View>
                  )}

                  {/* Overlay Gradients */}
                  <LinearGradient
                     colors={[ 'rgba(0,0,0,0.4)', 'transparent' ]}
                     style={styles.topGradient}
                  />
                  <LinearGradient
                     colors={[ 'transparent', 'rgba(0,0,0,0.9)' ]}
                     style={styles.bottomGradient}
                  />

                  {/* CONTENT */}
                  <View style={styles.mainContent}>
                     <View style={styles.topRow}>
                        <View style={[ styles.priceBadge, { backgroundColor: Colors[ them ].tint } ]}>
                           <Text style={styles.priceText}>{specialist.price} AZN</Text>
                        </View>
                        <View style={styles.ratingBadge}>
                           <Ionicons name="star" size={14} color="#fbbf24" />
                           <Text style={styles.ratingText}>5.0</Text>
                        </View>
                     </View>

                     <View style={styles.bottomContent}>
                        <Text style={styles.specialty}>{specialist.specialty}</Text>
                        <Text style={styles.name}>{specialist.name}</Text>

                        <View style={styles.footerRow}>
                           <View style={styles.experienceBadge}>
                              <Ionicons name="ribbon" size={18} color={Colors[ them ].tint} />
                              <Text style={styles.experienceText}>{specialist.experience} təcrübə</Text>
                           </View>
                           <View style={styles.circleArrow}>
                              <Ionicons name="chevron-forward" size={24} color="#FFF" />
                           </View>
                        </View>
                     </View>
                  </View>
               </View>
            </TouchableOpacity>
         </Link>
      </View>
   )
}

const styles = StyleSheet.create( {
   outerContainer: {
      width: '100%',
      height: CARD_HEIGHT,
      marginBottom: 30, // Force gap between cards
   },
   touchable: {
      flex: 1,
   },
   inner: {
      flex: 1,
      borderRadius: 36,
      overflow: 'hidden',
      position: 'relative',
      // For shadowing
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 12,
   },
   placeholder: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
   },
   topGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 120,
   },
   bottomGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 280,
   },
   mainContent: {
      ...StyleSheet.absoluteFillObject,
      padding: 24,
      justifyContent: 'space-between',
   },
   topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   priceBadge: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 18,
   },
   priceText: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '900',
   },
   ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
   },
   ratingText: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: '800',
      marginLeft: 4,
   },
   bottomContent: {
      width: '100%',
   },
   specialty: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 8,
   },
   name: {
      color: '#FFF',
      fontSize: 34,
      fontWeight: '900',
      letterSpacing: -1,
      marginBottom: 20,
   },
   footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   experienceBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
   },
   experienceText: {
      color: '#FFF',
      fontSize: 15,
      fontWeight: '700',
      marginLeft: 10,
   },
   circleArrow: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255,255,255,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.3)',
   }
} )
