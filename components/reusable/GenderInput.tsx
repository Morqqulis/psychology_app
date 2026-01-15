import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SlideModal from './SlideModal'

interface GenderInputProps<T extends FieldValues> {
   control: Control<T>
   name: Path<T>
   label?: string
   placeholder: string
   variant?: 'default' | 'primary'
}

const genderOptions = [
   { label: 'male', title: 'Kişi' },
   { label: 'female', title: 'Qadın' },
]

const genderMap: Record<string, string> = {
   male: 'Kişi',
   female: 'Qadın',
}

export default function GenderInput<T extends FieldValues>( {
   control,
   name,
   placeholder,
   label,
   variant = 'default',
}: GenderInputProps<T> ) {
   const [ modalVisible, setModalVisible ] = useState( false )
   const { them } = useMainContext()
   const closeModal = () => setModalVisible( false )

   const { backgroundColor, color } =
      variant === 'primary'
         ? {
            color: Colors[ them ].black,
            backgroundColor: Colors[ them ].light,
         }
         : {
            color: Colors[ them ].text,
            backgroundColor: Colors[ them ].surface,
         }

   return (
      <Controller
         control={control}
         name={name}
         render={( { field: { onChange, value }, fieldState: { error } } ) => (
            <View style={styles.container}>
               {label && <Text style={[ styles.label, { color } ]}>{label}</Text>}
               <TouchableOpacity
                  onPress={() => setModalVisible( !modalVisible )}
                  style={[
                     styles.inputContainer,
                     {
                        backgroundColor,
                        borderColor: error ? '#ff4757' : Colors[ them ].lightgray,
                     },
                  ]}
               >
                  <MaterialCommunityIcons
                     name="gender-male-female"
                     size={20}
                     color={Colors[ them ].icon}
                     style={styles.icon}
                  />
                  <Text style={value ? { color } : styles.placeholder}>
                     {value ? genderMap[ value ] : placeholder}
                  </Text>
               </TouchableOpacity>
               {error && <Text style={styles.error}>{error.message}</Text>}
               <SlideModal
                  direction="bottom"
                  distance={25}
                  visible={modalVisible}
                  onClose={closeModal}
                  viewStyle={{
                     borderTopLeftRadius: 20,
                     borderTopRightRadius: 20,
                  }}
               >
                  <View style={styles.modalContext}>
                     <View style={{ marginBottom: 10 }}>
                        <Text style={{ fontSize: 18, color: '#1A1A1A' }}>
                           Cinsinizi seçin
                        </Text>
                     </View>

                     {genderOptions.map( ( item ) => (
                        <TouchableOpacity
                           key={item.label}
                           style={[
                              styles.option,
                              value === item.label && styles.selectedValue,
                           ]}
                           onPress={() => {
                              onChange( item.label )
                              closeModal()
                           }}
                        >
                           <Text style={{ fontSize: 18, marginLeft: 12 }}>
                              {item.title}
                           </Text>
                        </TouchableOpacity>
                     ) )}
                  </View>
               </SlideModal>
            </View>
         )}
      />
   )
}

const styles = StyleSheet.create( {
   container: {
      marginBottom: 16,
   },
   label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
   },
   modalContext: {
      width: '100%',
      padding: 20,
      height: 170,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      backgroundColor: 'white',
      gap: 4,
   },
   option: {
      padding: 12,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: '#ECEDEE',
      borderRadius: 8,
   },
   inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      minHeight: 56,
   },
   icon: {
      marginRight: 12,
   },
   selectedValue: {
      borderWidth: 2,
      borderColor: '#667eea',
   },
   placeholder: {
      flex: 1,
      fontSize: 16,
      color: '#777',
   },
   error: {
      color: Colors[ 'dark' ].error,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 12,
   },
} )
