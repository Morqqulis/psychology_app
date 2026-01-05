import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { useUserContext } from '@/providers/UserProvider'
import { Payment, usePaymentHistory } from '@/services/payments/payments'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'

const statusLabels: Record<Payment[ 'status' ], string> = {
   pending: 'Gözləyir',
   success: 'Uğurlu',
   failed: 'Uğursuz',
}

const statusColors: Record<Payment[ 'status' ], string> = {
   pending: '#f59e0b',
   success: '#10b981',
   failed: '#ef4444',
}

const PaymentItem = ( { payment, theme }: { payment: Payment; theme: 'dark' | 'light' } ) => {
   const date = new Date( payment.createdAt )
   const formattedDate = date.toLocaleDateString( 'az-AZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
   } )

   return (
      <View style={[ styles.paymentItem, { backgroundColor: Colors[ theme ].bubble } ]}>
         <View style={styles.paymentLeft}>
            <Ionicons
               name={payment.status === 'success' ? 'checkmark-circle' : payment.status === 'pending' ? 'time' : 'close-circle'}
               size={24}
               color={statusColors[ payment.status ]}
            />
            <View style={styles.paymentInfo}>
               <Text style={[ styles.paymentAmount, { color: Colors[ theme ].text } ]}>
                  {payment.amount} {payment.currency}
               </Text>
               <Text style={[ styles.paymentDate, { color: Colors[ theme ].icon } ]}>
                  {formattedDate}
               </Text>
            </View>
         </View>
         <View style={[ styles.statusBadge, { backgroundColor: statusColors[ payment.status ] + '20' } ]}>
            <Text style={[ styles.statusText, { color: statusColors[ payment.status ] } ]}>
               {statusLabels[ payment.status ]}
            </Text>
         </View>
      </View>
   )
}

export const PaymentHistory = () => {
   const { them } = useMainContext()
   const { user } = useUserContext()
   const { data, isLoading, error } = usePaymentHistory( user?.id )

   if ( isLoading ) {
      return (
         <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors[ them ].primary} />
         </View>
      )
   }

   if ( error ) {
      return (
         <View style={styles.centerContainer}>
            <Ionicons name="alert-circle" size={48} color={Colors[ them ].icon} />
            <Text style={[ styles.emptyText, { color: Colors[ them ].icon } ]}>
               Xəta baş verdi
            </Text>
         </View>
      )
   }

   if ( !data?.docs?.length ) {
      return (
         <View style={styles.centerContainer}>
            <Ionicons name="receipt-outline" size={48} color={Colors[ them ].icon} />
            <Text style={[ styles.emptyText, { color: Colors[ them ].icon } ]}>
               Hələ ödəniş yoxdur
            </Text>
         </View>
      )
   }

   return (
      <FlatList
         data={data.docs}
         keyExtractor={( item ) => item.id.toString()}
         renderItem={( { item } ) => <PaymentItem payment={item} theme={them} />}
         contentContainerStyle={styles.listContainer}
         showsVerticalScrollIndicator={false}
      />
   )
}

const styles = StyleSheet.create( {
   centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
   },
   emptyText: {
      fontSize: 16,
      textAlign: 'center',
   },
   listContainer: {
      padding: 16,
      gap: 12,
   },
   paymentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
   },
   paymentLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   paymentInfo: {
      gap: 4,
   },
   paymentAmount: {
      fontSize: 16,
      fontWeight: '600',
   },
   paymentDate: {
      fontSize: 12,
   },
   statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
   },
   statusText: {
      fontSize: 12,
      fontWeight: '500',
   },
} )
