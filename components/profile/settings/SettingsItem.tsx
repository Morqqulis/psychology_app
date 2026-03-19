import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'

interface Props {
   title: string
   description?: string
   icon: keyof typeof Ionicons.glyphMap
   onPress: () => void
}

export default function SettingsItem( { title, description, icon, onPress }: Props ) {
   const { them } = useMainContext()

   return (
      <TouchableOpacity
         style={[ styles.container, { backgroundColor: Colors[ them ].surface } ]}
         onPress={onPress}
      >
         <View style={[ styles.iconContainer, { backgroundColor: Colors[ them ].background } ]}>
            <Ionicons name={icon} size={20} color={Colors[ them ].text} />
         </View>
         <View style={styles.textContainer}>
            <Text style={[ styles.title, { color: Colors[ them ].text } ]}>{title}</Text>
            {description && (
               <Text style={[ styles.description, { color: Colors[ them ].icon } ]}>
                  {description}
               </Text>
            )}
         </View>
         <Ionicons name='chevron-forward' size={20} color={Colors[ them ].icon} />
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create( {
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
   },
   iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
   },
   textContainer: {
      flex: 1,
   },
   title: {
      fontSize: 16,
      fontWeight: '600',
   },
   description: {
      fontSize: 13,
      marginTop: 2,
   },
} )
