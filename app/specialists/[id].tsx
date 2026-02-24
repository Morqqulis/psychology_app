import { Colors } from '@/constants/theme'
import { showToast } from '@/hooks/useToast'
import { useMainContext } from '@/providers/MainProvider'
import { startEpointPayment } from '@/services/payments/epoint'
import { useSpecialist } from '@/services/specialists/specialists'
import { getImageUrl } from '@/shared/utils/image'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Dimensions, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const { width } = Dimensions.get( 'window' )

export default function SpecialistDetailScreen() {
   const { id } = useLocalSearchParams()
   const router = useRouter()
   const { them } = useMainContext()
   const isDark = them === 'dark'
   const { data: specialist, isLoading } = useSpecialist( id as string )
   const [ isPaying, setIsPaying ] = useState( false )

   if ( isLoading || !specialist ) {
      return (
         <View style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}>
            <ActivityIndicator size="large" color={Colors[ them ].tint} style={{ marginTop: 50 }} />
         </View>
      )
   }

   const handleWhatsApp = () => {
      if ( specialist.whatsapp ) {
         const url = `whatsapp://send?phone=${specialist.whatsapp}`
         Linking.canOpenURL( url ).then( supported => {
            if ( supported ) {
               Linking.openURL( url )
            } else {
               showToast( {
                  title: "WhatsApp tapılmadı",
                  message: "Zəhmət olmasa WhatsApp tətbiqinin quraшdırıldığından əmin olun",
                  type: "error"
               } )
            }
         } )
      }
   }

   const handlePayment = async () => {
      if ( isPaying ) return
      try {
         setIsPaying( true )
         await startEpointPayment( {
            amount: specialist.price,
            description: `${specialist.name} - Məsləhət qəbulu üçün ödəniş`,
            productType: 'appointment',
            specialistId: specialist.id,
         } )
      } catch ( error ) {
         console.error( error )
         showToast( {
            title: "Ödəniş xətası",
            message: "Ödəniş başladılarkən xəta baş verdi. Yenidən cəhd edin.",
            type: "error"
         } )
      } finally {
         setIsPaying( false )
      }
   }

   const imageUrl = getImageUrl( specialist.image )

   return (
      <View style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}>
         <Stack.Screen options={{ headerShown: false, headerTitle: '', headerBackTitle: 'Geri' }} />
         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Header Image with Overlay */}
            <View style={styles.imageHeader}>
               {imageUrl ? (
                  <Image
                     source={{ uri: imageUrl }}
                     style={styles.headerImage}
                     contentFit="cover"
                  />
               ) : (
                  <View style={[ styles.headerImage, { backgroundColor: isDark ? '#374151' : '#f3f4f6', justifyContent: 'center', alignItems: 'center' } ]}>
                     <Ionicons name="person" size={100} color={Colors[ them ].icon} />
                  </View>
               )}
               <LinearGradient
                  colors={[ 'rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)' ]}
                  style={styles.imageOverlay}
               />

               <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#FFF" />
               </TouchableOpacity>

               <View style={styles.headerInfo}>
                  <Text style={styles.headerName}>{specialist.name}</Text>
                  <Text style={styles.headerSpecialty}>{specialist.specialty}</Text>
               </View>
            </View>

            <View style={[ styles.contentCard, { backgroundColor: Colors[ them ].background } ]}>
               {/* Stats Row */}
               <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                     <View style={[ styles.statIcon, { backgroundColor: isDark ? '#374151' : '#f3f4f6' } ]}>
                        <Ionicons name="star" size={18} color="#fbbf24" />
                     </View>
                     <Text style={[ styles.statValue, { color: Colors[ them ].text } ]}>5.0</Text>
                     <Text style={[ styles.statLabel, { color: Colors[ them ].icon } ]}>Reytinq</Text>
                  </View>

                  <View style={styles.statItem}>
                     <View style={[ styles.statIcon, { backgroundColor: isDark ? '#374151' : '#f3f4f6' } ]}>
                        <Ionicons name="briefcase" size={18} color={Colors[ them ].tint} />
                     </View>
                     <Text style={[ styles.statValue, { color: Colors[ them ].text } ]}>{specialist.experience}</Text>
                     <Text style={[ styles.statLabel, { color: Colors[ them ].icon } ]}>Təcrübə</Text>
                  </View>

                  <View style={styles.statItem}>
                     <View style={[ styles.statIcon, { backgroundColor: isDark ? '#374151' : '#f3f4f6' } ]}>
                        <Ionicons name="wallet" size={18} color="#10b981" />
                     </View>
                     <Text style={[ styles.statValue, { color: Colors[ them ].text } ]}>{specialist.price} AZN</Text>
                     <Text style={[ styles.statLabel, { color: Colors[ them ].icon } ]}>Qiymət</Text>
                  </View>
               </View>

               {/* Bio Section */}
               <View style={styles.section}>
                  <Text style={[ styles.sectionTitle, { color: Colors[ them ].text } ]}>Haqqında</Text>
                  <Text style={[ styles.description, { color: Colors[ them ].text } ]}>
                     {specialist.description}
                  </Text>
               </View>

               {/* Consultation Info */}
               <View style={styles.section}>
                  <Text style={[ styles.sectionTitle, { color: Colors[ them ].text } ]}>Xidmət məlumatı</Text>
                  <View style={[ styles.infoBox, { backgroundColor: isDark ? '#1f2937' : '#f8f9fa' } ]}>
                     <View style={styles.infoRow}>
                        <Ionicons name="videocam-outline" size={20} color={Colors[ them ].icon} />
                        <Text style={[ styles.infoText, { color: Colors[ them ].text } ]}>Online video/səsli konsultasiya</Text>
                     </View>
                     <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color={Colors[ them ].icon} />
                        <Text style={[ styles.infoText, { color: Colors[ them ].text } ]}>Müddət: 15-20 dəqiqə</Text>
                     </View>
                     <View style={styles.infoRow}>
                        <Ionicons name="shield-checkmark-outline" size={20} color={Colors[ them ].icon} />
                        <Text style={[ styles.infoText, { color: Colors[ them ].text } ]}>Tam məxfilik qorunur</Text>
                     </View>
                  </View>
               </View>
            </View>
         </ScrollView>

         <View style={[ styles.footer, { backgroundColor: Colors[ them ].surface, borderTopColor: Colors[ them ].border } ]}>
            {specialist.whatsapp ? (
               <TouchableOpacity style={[ styles.button, styles.whatsappButton ]} onPress={handleWhatsApp}>
                  <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
                  <Text style={styles.buttonText}>WhatsApp ilə əlaqə</Text>
               </TouchableOpacity>
            ) : (
               <TouchableOpacity
                  activeOpacity={0.8}
                  style={[ styles.button, { backgroundColor: Colors[ them ].primary } ]}
                  onPress={handlePayment}
                  disabled={isPaying}
               >
                  {isPaying ? (
                     <ActivityIndicator color="#FFF" />
                  ) : (
                     <Text style={styles.buttonText}>Qəbula yazıl ({specialist.price} AZN)</Text>
                  )}
               </TouchableOpacity>
            )}
         </View>
      </View>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
   },
   scrollContent: {
      paddingBottom: 120,
   },
   imageHeader: {
      width: width,
      height: 400,
      position: 'relative',
   },
   headerImage: {
      width: '100%',
      height: '100%',
   },
   imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
   },
   backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   headerInfo: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
   },
   headerName: {
      color: '#FFF',
      fontSize: 32,
      fontWeight: '900',
      letterSpacing: -1,
   },
   headerSpecialty: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: 18,
      fontWeight: '600',
      marginTop: 4,
   },
   contentCard: {
      marginTop: -25,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 30,
   },
   statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 10,
      marginBottom: 30,
   },
   statItem: {
      alignItems: 'center',
      width: width / 3.5,
   },
   statIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
   },
   statValue: {
      fontSize: 16,
      fontWeight: '800',
   },
   statLabel: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 2,
   },
   section: {
      paddingHorizontal: 25,
      marginBottom: 30,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 15,
      letterSpacing: -0.5,
   },
   description: {
      fontSize: 16,
      lineHeight: 26,
      opacity: 0.8,
   },
   infoBox: {
      padding: 20,
      borderRadius: 20,
   },
   infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
   },
   infoText: {
      marginLeft: 12,
      fontSize: 14,
      fontWeight: '600',
   },
   footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      paddingBottom: Platform.OS === 'ios' ? 35 : 20,
      borderTopWidth: 1,
   },
   button: {
      height: 60,
      borderRadius: 30,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
   },
   whatsappButton: {
      backgroundColor: '#25D366',
   },
   buttonText: {
      color: '#FFF',
      fontSize: 17,
      fontWeight: '800',
      marginLeft: 10,
   }
} )
