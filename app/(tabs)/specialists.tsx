import { SpecialistCard } from '@/components/specialists/SpecialistCard'
import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { Specialist, useSpecialists } from '@/services/specialists/specialists'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, Text, View, FlatList } from 'react-native'

export default function SpecialistsScreen() {
   const { them } = useMainContext()
   const { data, isLoading, refetch, isRefetching } = useSpecialists()

   const specialists = data?.docs || []

   if ( isLoading ) {
      return (
         <View style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}>
            <View style={styles.center}>
               <ActivityIndicator size="large" color={Colors[ them ].tint} />
            </View>
         </View>
      )
   }

   return (
      <View style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}>
         <FlatList<Specialist>
            data={specialists}
            renderItem={( { item } ) => <SpecialistCard specialist={item} />}
            keyExtractor={( item ) => item.id.toString()}
            numColumns={1}
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={
               <View style={styles.header}>
                  <View style={styles.titleRow}>
                     <View>
                        <Text style={[ styles.title, { color: Colors[ them ].text } ]}>Mütəxəssislər</Text>
                        <View style={[ styles.underline, { backgroundColor: Colors[ them ].tint } ]} />
                     </View>
                  </View>
                  <Text style={[ styles.subtitle, { color: Colors[ them ].icon } ]}>
                     Peşəkar yardım üçün təcrübəli mütəxəssislərimizə müraciət edin.
                  </Text>
               </View>
            }
            refreshControl={
               <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  tintColor={Colors[ them ].tint}
                  progressViewOffset={40}
               />
            }
            ListEmptyComponent={
               <View style={styles.emptyCenter}>
                  <Ionicons name="search-outline" size={48} color={Colors[ them ].icon} style={{ opacity: 0.5 }} />
                  <Text style={[ styles.emptyText, { color: Colors[ them ].icon } ]}>Heç bir mütəxəssis tapılmadı</Text>
               </View>
            }
            ListFooterComponent={<View style={{ height: 40 }} />}
         />
      </View>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
   },
   header: {
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 24,
      alignItems: 'center',
   },
   titleRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
   },
   title: {
      fontSize: 32,
      fontWeight: '900',
      letterSpacing: -1,
      textAlign: 'center',
   },
   underline: {
      height: 4,
      width: 40,
      borderRadius: 2,
      marginTop: -4,
      alignSelf: 'center',
   },
   subtitle: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '500',
      textAlign: 'center',
      width: '100%',
   },
   listContainer: {
      paddingBottom: 40,
   },
   center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   emptyCenter: {
      marginTop: 60,
      justifyContent: 'center',
      alignItems: 'center',
   },
   emptyText: {
      marginTop: 16,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
   }
} )
