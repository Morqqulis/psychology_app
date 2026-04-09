import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable'

import { ThemedText } from '@/components/ui/themed-text'

const { width, height } = Dimensions.get( 'window' )

export interface OnboardingSlideProps {
   id: string
   title: string
   description: string
   image: any
   icon: keyof typeof Ionicons.glyphMap
   isHero?: boolean
}

export const SLIDES: OnboardingSlideProps[] = [
   {
      id: '1',
      title: 'Nur Yoluna\nXoş Gəldiniz',
      description: 'Nur Yolu - psixoloji dəstək və rəqəmsal bələdçinizdir. Burada sizi anlayan və qoruyan bir mühit var.',
      image: require( '@/assets/images/logo.png' ),
      icon: 'heart-outline',
      isHero: true
   },
   {
      id: '2',
      title: 'Rəqəmsal\nBələdçi',
      description: 'Süni intellekt əsaslı bələdçimizlə 7/24 anonim söhbət edin. O sizi dinləyəcək, vəziyyətinizi analiz edəcək və düzgün yönləndirəcək.',
      image: require( '@/assets/images/logo.png' ),
      icon: 'chatbubbles-outline'
   },
   {
      id: '3',
      title: 'VIP\nÜstünlüklər',
      description: 'VIP üzvlər limitsiz mesajlaşma, daha dərin emosional analizlər və mütəxəssislərlə prioritet əlaqə imkanından istifadə edir.',
      image: require( '@/assets/images/logo.png' ),
      icon: 'star-outline'
   },
   {
      id: '4',
      title: 'Peşəkar\nMütəxəssislər',
      description: 'Daha dərin dəstəyə ehtiyacınız olduqda, platformadakı təcrübəli psixoloqlarla birbaşa əlaqə saxlayıb seans təyin edin.',
      image: require( '@/assets/images/logo.png' ),
      icon: 'people-outline'
   },
   {
      id: '5',
      title: 'Dostlarını Dəvət Et,\nBonus Qazan',
      description: 'Öз unikal referal kodunu dostlarınla paylaş. Hər yeni qeydiyyat üçün həm sən, həm də dostun AI ilə əlavə pulsuz mesajlar qazanacaqsınız!',
      image: require( '@/assets/images/logo.png' ),
      icon: 'gift-outline'
   },
   {
      id: '6',
      title: 'Necə Başlamaq\nLazımdır?',
      description: 'Sadəcə hesab yaradın və rəqəmsal bələdçimizlə ilk söhbэтinizə başlayın. Tamamən məxfi və güvənlidir.',
      image: require( '@/assets/images/logo.png' ),
      icon: 'shield-checkmark-outline'
   }
]

// ─── Styled Description Component ────────────────────────────────────────────

function StyledDescription( { item }: { item: OnboardingSlideProps } ) {
   return (
      <Animatable.View animation="fadeInUp" duration={900} delay={500} style={{ width: '100%' }}>
         {/* Divider (Show sparkle logic for Hero or subtle line for others) */}
         <View style={heroStyles.dividerContainer}>
            <LinearGradient
               colors={[ 'transparent', item.isHero ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.5)', item.isHero ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 255, 255, 0.2)', 'transparent' ]}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 0 }}
               style={heroStyles.dividerLine}
            />
            {item.isHero && (
               <View style={heroStyles.dividerIconWrap}>
                  <Ionicons name="sparkles" size={12} color="rgba(255, 215, 0, 0.9)" />
               </View>
            )}
         </View>

         {/* Glassmorphism description card */}
         <View style={[ heroStyles.cardOuter, !item.isHero && { borderColor: 'rgba(255, 255, 255, 0.15)' } ]}>
            <BlurView intensity={30} tint="dark" style={heroStyles.card}>
               <LinearGradient
                  colors={[ 'rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.05)' ]}
                  style={heroStyles.cardGradient}
               >
                  {item.isHero ? (
                     <Text style={heroStyles.baseText}>
                        <Text style={heroStyles.brandName}>Nur Yolu</Text>
                        <Text style={heroStyles.accentText}>
                           — psixoloji dəstək və rəqəmsal bələdçinizdir.

                        </Text>
                        {'\nBurada sizi anlayan və qoruyan bir mühit var.'}
                     </Text>
                  ) : (
                     <Text style={heroStyles.baseText}>{item.description}</Text>
                  )}
               </LinearGradient>
            </BlurView>
         </View>
      </Animatable.View>
   )
}

// ─── Main Slide Component ────────────────────────────────────────────────────

export function OnboardingSlide( { item }: { item: OnboardingSlideProps } ) {
   return (
      <View style={styles.container}>
         <Animatable.View animation="zoomIn" duration={800} style={styles.imageContainer}>
            <Image
               source={item.image}
               style={styles.image}
               resizeMode="contain"
            />
         </Animatable.View>

         <Animatable.View animation="fadeInUp" duration={800} delay={300} style={styles.textContainer}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <StyledDescription item={item} />
         </Animatable.View>
      </View>
   )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const heroStyles = StyleSheet.create( {
   dividerContainer: {
      alignItems: 'center',
      marginBottom: 12,
      position: 'relative',
   },
   dividerLine: {
      height: 1.5,
      width: width * 0.5,
      borderRadius: 1,
   },
   dividerIconWrap: {
      position: 'absolute',
      top: -6,
      backgroundColor: 'transparent',
      paddingHorizontal: 10,
   },
   cardOuter: {
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 215, 0, 0.25)',
      width: '100%',
   },
   card: {
      overflow: 'hidden',
   },
   cardGradient: {
      paddingVertical: 14,
      paddingHorizontal: 18,
   },
   baseText: {
      fontSize: 15.5,
      color: 'rgba(255, 255, 255, 0.95)',
      lineHeight: 22,
      textAlign: 'center',
   },
   brandName: {
      fontWeight: '700',
      color: '#FFD700',
      fontSize: 16,
   },
   accentText: {
      fontWeight: '600',
      color: '#fff',
      fontStyle: 'italic',
   },
} )

const styles = StyleSheet.create( {
   container: {
      flex: 1,
      width,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
   },
   imageContainer: {
      flex: 0.45,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
   },
   image: {
      width: width * 0.75,
      height: height * 0.28,
   },
   textContainer: {
      flex: 0.55,
      alignItems: 'center',
      paddingHorizontal: 20,
   },
   title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: 10,
      lineHeight: 34,
   }
} )
