import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'

interface GenderInputProps<T extends FieldValues> {
   control: Control<T>
   name: Path<T>
   label?: string
   placeholder?: string
   variant?: 'default' | 'primary'
}

interface GenderOption {
   value: 'male' | 'female'
   title: string
   icon: keyof typeof MaterialCommunityIcons.glyphMap
   accent: string
   /** Subtle fill when the option is selected (primary variant cards). */
   selectedSurface: string
}

const genderOptions: GenderOption[] = [
   {
      value: 'male',
      title: 'Kişi',
      icon: 'gender-male',
      accent: '#3b82f6',
      selectedSurface: 'rgba(59, 130, 246, 0.12)',
   },
   {
      value: 'female',
      title: 'Qadın',
      icon: 'gender-female',
      accent: '#ec4899',
      selectedSurface: 'rgba(236, 72, 153, 0.12)',
   },
]

export default function GenderInput<T extends FieldValues>( {
   control,
   name,
   label,
   variant = 'default',
}: GenderInputProps<T> ) {
   const { them } = useMainContext()
   const isPrimary = variant === 'primary'

   const palette = isPrimary
      ? {
         labelColor: '#fff',
         cardBg: Colors[ them ].light,
         /** Stronger than `lightgray` so the stroke reads on near‑white cards. */
         inactiveBorder: them === 'light' ? '#64748b' : '#94a3b8',
         inactiveText: Colors[ them ].text,
         onCardInactiveText: Colors[ them ].black,
         inactiveIcon: Colors[ them ].icon,
         inactiveIconWell: 'rgba(0,0,0,0.06)',
      }
      : {
         labelColor: Colors[ them ].text,
         cardBg: them === 'dark' ? '#1f2937' : '#ffffff',
         inactiveBorder: them === 'dark' ? '#4b5563' : '#cbd5e1',
         inactiveText: Colors[ them ].text,
         onCardInactiveText: Colors[ them ].text,
         inactiveIcon: Colors[ them ].icon,
         inactiveIconWell: them === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      }

   return (
      <Controller
         control={control}
         name={name}
         render={( { field: { onChange, value }, fieldState: { error } } ) => {
            const handleSelect = ( next: GenderOption[ 'value' ] ) => {
               if ( value === next ) return
               if ( Platform.OS === 'ios' || Platform.OS === 'android' ) {
                  Haptics.selectionAsync().catch( () => { } )
               }
               onChange( next )
            }

            return (
               <View style={styles.container}>
                  {label && (
                     <Text style={[ styles.label, { color: palette.labelColor } ]}>
                        {label}
                     </Text>
                  )}

                  <View style={styles.grid}>
                     {genderOptions.map( ( option ) => {
                        const isActive = value === option.value
                        const accent = option.accent

                        const textColor = isActive ? accent : palette.onCardInactiveText
                        const iconColor = isActive ? accent : palette.inactiveIcon
                        const cardBackground = isActive
                           ? option.selectedSurface
                           : palette.cardBg
                        const iconWellBg = isActive
                           ? `${accent}18`
                           : palette.inactiveIconWell

                        const cardBorderColor = isActive
                           ? accent
                           : palette.inactiveBorder

                        return (
                           <View key={option.value} style={styles.gridCell}>
                              <View
                                 style={[
                                    styles.cardChrome,
                                    {
                                       borderColor: cardBorderColor,
                                       backgroundColor: cardBackground,
                                    },
                                 ]}
                              >
                                 <Pressable
                                    onPress={() => handleSelect( option.value )}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: isActive }}
                                    accessibilityLabel={option.title}
                                    hitSlop={6}
                                    android_ripple={{
                                       color: `${accent}28`,
                                       borderless: false,
                                    }}
                                    style={( { pressed } ) => [
                                       styles.cardPressable,
                                       { opacity: pressed ? 0.96 : 1 },
                                    ]}
                                 >
                                    <View style={styles.cardRow}>
                                       <View
                                          style={[
                                             styles.iconSlot,
                                             { backgroundColor: iconWellBg },
                                          ]}
                                       >
                                          <MaterialCommunityIcons
                                             name={option.icon}
                                             size={22}
                                             color={iconColor}
                                          />
                                       </View>

                                       <Text
                                          style={[
                                             styles.cardTitle,
                                             { color: textColor },
                                          ]}
                                          numberOfLines={1}
                                          ellipsizeMode="tail"
                                       >
                                          {option.title}
                                       </Text>

                                       <View style={styles.cardTrail}>
                                          {isActive ? (
                                             <View
                                                style={[
                                                   styles.checkBadge,
                                                   { borderColor: accent },
                                                ]}
                                             >
                                                <MaterialCommunityIcons
                                                   name="check"
                                                   size={14}
                                                   color={accent}
                                                />
                                             </View>
                                          ) : (
                                             <View style={styles.trailSpacer} />
                                          )}
                                       </View>
                                    </View>
                                 </Pressable>
                              </View>
                           </View>
                        )
                     } )}
                  </View>

                  {error?.message && (
                     <Text style={[ styles.error, { color: Colors[ them ].error } ]}>
                        {error.message}
                     </Text>
                  )}
               </View>
            )
         }}
      />
   )
}

const styles = StyleSheet.create( {
   container: {
      marginBottom: 16,
      width: '100%',
      /** Same pattern as full‑bleed inputs: parent `alignItems: 'center'` won't shrink us to icon width. */
      alignSelf: 'stretch',
   },
   label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
   },
   /** One full‑width card per row (avoids narrow columns / clipped labels on Android). */
   grid: {
      flexDirection: 'column',
      alignSelf: 'stretch',
      width: '100%',
      gap: 10,
   },
   gridCell: {
      width: '100%',
      alignSelf: 'stretch',
   },
   cardChrome: {
      width: '100%',
      alignSelf: 'stretch',
      borderRadius: 12,
      borderWidth: 2,
      borderStyle: 'solid',
      overflow: 'hidden',
   },
   cardPressable: {
      flexGrow: 1,
      alignSelf: 'stretch',
      width: '100%',
   },
   cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      paddingVertical: 12,
      paddingHorizontal: 12,
      width: '100%',
   },
   /** Squircle icon area — reads as part of a card row, not a round FAB. */
   iconSlot: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
   },
   cardTitle: {
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
      marginLeft: 10,
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.15,
   },
   cardTrail: {
      marginLeft: 6,
      width: 28,
      flexShrink: 0,
      alignItems: 'flex-end',
      justifyContent: 'center',
   },
   trailSpacer: {
      width: 28,
      height: 28,
   },
   checkBadge: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      backgroundColor: 'rgba(255,255,255,0.92)',
   },
   error: {
      fontSize: 12,
      marginTop: 6,
      marginLeft: 4,
   },
} )
