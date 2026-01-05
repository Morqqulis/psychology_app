import { Colors } from "@/constants/theme"
import { showToast } from "@/hooks/useToast"
import { useMainContext } from "@/providers/MainProvider"
import { useTranscribeVoice } from "@/services/chat/chat"
import { IAiInputType } from "@/shared/interface"
import { Ionicons } from "@expo/vector-icons"
import {
   RecordingPresets,
   useAudioRecorder,
   useAudioRecorderState,
} from "expo-audio"
import * as Haptics from "expo-haptics"
import React, { useMemo, useState } from "react"
import {
   ActivityIndicator,
   KeyboardAvoidingView,
   Platform,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native"
import SendButton from "./SendButton"
import { VoiceRecording } from "./VoiceRecording"

interface ChatInputProps {
   onSendMessage: ( message: string ) => void
   disabled: boolean
}

export function ChatInput( { onSendMessage, disabled }: ChatInputProps ) {
   const { them } = useMainContext()
   const [ type, setType ] = useState<IAiInputType>( "voice" )
   const [ message, setMessage ] = useState( "" )
   const [ isTranscribing, setIsTranscribing ] = useState( false )
   const recorder = useAudioRecorder( RecordingPresets.HIGH_QUALITY )
   const recorderState = useAudioRecorderState( recorder )
   const transcribeVoice = useTranscribeVoice()
   const inputRef = React.useRef<TextInput>( null )

   const isDark = them === 'dark'

   const themedStyles = useMemo( () => ( {
      containerBorder: isDark ? Colors[ them ].surface : '#e5e7eb',
      inputBg: isDark ? Colors[ them ].surface : '#f3f4f6',
      inputBorder: isDark ? Colors[ them ].bubble : '#e5e7eb',
      inputText: Colors[ them ].text,
      placeholderText: Colors[ them ].icon,
      clearButtonBg: isDark ? Colors[ them ].bubble : '#e5e7eb',
      clearButtonBorder: isDark ? Colors[ them ].charcoal : '#d1d5db',
      counterText: Colors[ them ].icon,
      counterBg: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
   } ), [ them, isDark ] )

   const handleSend = async () => {
      if ( !message.trim() || disabled || isTranscribing ) return
      Haptics.impactAsync( Haptics.ImpactFeedbackStyle.Light ).catch( () => { } )
      onSendMessage( message.trim() )
      setMessage( "" )
      setType( "voice" )
   }

   const stopAndTranscribe = async () => {
      const uri = await stop()
      if ( !uri ) {
         showToast( {
            title: "Səhv",
            message: "Səsli mesaj göndərilmədi",
            type: "error",
         } )
         setType( "voice" )
         return
      }
      setType( "voice" )
      setIsTranscribing( true )
      try {
         const transcription = await transcribeVoice.mutateAsync( uri )
         setMessage( transcription )
         setType( "text" )
         setTimeout( () => inputRef.current?.focus(), 50 )
      } catch ( error: unknown ) {
         const errorMessage = error instanceof Error ? error.message : 'Səs mesajını oxumaq mümkün olmadı'
         showToast( {
            title: "Xəta",
            message: errorMessage,
            type: "error",
         } )
         setType( "voice" )
      } finally {
         setIsTranscribing( false )
      }
   }

   const stop = async () => {
      if ( recorderState.isRecording ) {
         await recorder.stop()
      }
      const url = recorderState.url
      if ( recorderState.isRecording ) {
         recorderState.isRecording = false
      }
      return url
   }

   const cancelVoiceRecording = async () => {
      if ( recorderState.isRecording ) {
         await recorder.stop()
      }
      setType( "voice" )
   }

   return (
      <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : "padding"}
         keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 30}
      >
         <View
            style={[
               styles.container,
               {
                  backgroundColor: Colors[ them ].background,
                  borderTopColor: themedStyles.containerBorder,
               }
            ]}
         >
            <View
               style={[
                  styles.inputContainer,
                  {
                     backgroundColor: themedStyles.inputBg,
                     borderColor: themedStyles.inputBorder,
                  }
               ]}
            >
               {type === "record" ? (
                  <VoiceRecording
                     onCancel={cancelVoiceRecording}
                     recorder={recorder}
                     recorderState={recorderState}
                  />
               ) : isTranscribing ? (
                  <View style={styles.transcribingContainer}>
                     <ActivityIndicator size="small" color={Colors[ them ].primary} />
                     <Text style={[ styles.transcribingText, { color: Colors[ them ].text } ]}>
                        Səs mesajı oxunur...
                     </Text>
                  </View>
               ) : (
                  <View style={styles.inputWrapper}>
                     <View style={styles.inputRow}>
                        <TextInput
                           ref={inputRef}
                           style={[ styles.textInput, { color: themedStyles.inputText } ]}
                           value={message}
                           onChangeText={( text ) => {
                              setMessage( text )
                              if ( text.trim() ) {
                                 setType( "text" )
                              } else {
                                 setType( "voice" )
                              }
                           }}
                           onContentSizeChange={() => {
                              if ( !message.trim() ) {
                                 return
                              }
                           }}
                           placeholder="Mesaj yazın..."
                           placeholderTextColor={`${themedStyles.placeholderText}99`}
                           multiline
                           maxLength={500}
                           editable={!disabled && !isTranscribing}
                        />
                        {message.length > 0 && !disabled && !isTranscribing && (
                           <TouchableOpacity
                              style={[
                                 styles.clearButton,
                                 {
                                    backgroundColor: themedStyles.clearButtonBg,
                                    borderColor: themedStyles.clearButtonBorder,
                                 }
                              ]}
                              onPress={() => {
                                 setMessage( "" )
                                 setType( "voice" )
                              }}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                           >
                              <Ionicons name="close" size={16} color={Colors[ them ].icon} />
                           </TouchableOpacity>
                        )}
                     </View>
                     {message.length > 400 && (
                        <Text
                           style={[
                              styles.counterOverlay,
                              {
                                 color: themedStyles.counterText,
                                 backgroundColor: themedStyles.counterBg,
                              }
                           ]}
                        >
                           {message.length}/500
                        </Text>
                     )}
                  </View>
               )}
            </View>

            <SendButton
               type={type}
               setType={setType}
               handleSend={handleSend}
               disabled={isTranscribing || disabled}
               isRecording={type === "record"}
               hasText={!!message.trim()}
               onStopRecording={stopAndTranscribe}
               onStartRecording={() => Haptics.impactAsync( Haptics.ImpactFeedbackStyle.Light ).catch( () => { } )}
               isTranscribing={isTranscribing}
            />
         </View>
      </KeyboardAvoidingView>
   )
}

const styles = StyleSheet.create( {
   container: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: 5,
      paddingVertical: 8,
      borderTopWidth: 0.5,
   },
   inputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-end",
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginRight: 8,
      maxHeight: 230,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
   },
   textInput: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 6,
      paddingRight: 36,
      minHeight: 20,
      height: 'auto',
      maxHeight: 75,
      textAlignVertical: "top",
   },
   inputRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 6,
      position: "relative",
   },
   clearButton: {
      position: "absolute",
      right: 6,
      top: 6,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
      zIndex: 2,
   },
   transcribingContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
   },
   transcribingText: {
      fontSize: 14,
   },
   inputWrapper: {
      flex: 1,
      gap: 6,
      position: "relative",
   },
   counterOverlay: {
      position: "absolute",
      bottom: 6,
      right: 8,
      fontSize: 12,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 6,
      overflow: "hidden",
   },
   limitHint: {
      position: "absolute",
      bottom: 6,
      left: 10,
      fontSize: 11,
   },
} )
