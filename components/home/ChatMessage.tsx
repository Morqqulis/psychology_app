import { Colors } from "@/constants/theme"
import { handleCopy } from "@/functions/helper"
import { useMainContext } from "@/providers/MainProvider"
import { Ionicons } from "@expo/vector-icons"
import React, { memo, useEffect, useMemo, useRef } from "react"
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import AudioMsg from "./AudioMsg"

interface ChatMessageProps {
   message: {
      id: string
      text: string
      isUser: boolean
      type: "text" | "voice"
      timestamp: Date
      audioUri?: string
   }
   isNew?: boolean
}

export const ChatMessage = memo( function ChatMessage( { message, isNew = false }: ChatMessageProps ) {
   const { them } = useMainContext()

   // Memoize colors to prevent unnecessary re-renders
   const colors = useMemo( () => ( {
      backgroundColor: message.isUser ? Colors[ them ].primary : Colors[ them ].bubble,
      textColor: message.isUser ? Colors[ them ].white : Colors[ them ].charcoal,
      timestampColor: message.isUser ? "rgba(255,255,255,0.7)" : Colors[ them ].icon,
   } ), [ message.isUser, them ] )

   // Memoize formatted timestamp
   const formattedTime = useMemo( () =>
      message.timestamp.toLocaleTimeString( "az-AZ", {
         hour: "2-digit",
         minute: "2-digit",
      } ), [ message.timestamp ] )

   const slideAnim = useRef( new Animated.Value( isNew ? 50 : 0 ) ).current
   const opacityAnim = useRef( new Animated.Value( isNew ? 0 : 1 ) ).current
   const scaleAnim = useRef( new Animated.Value( isNew ? 0.8 : 1 ) ).current

   useEffect( () => {
      if ( isNew ) {
         Animated.parallel( [
            Animated.spring( slideAnim, {
               toValue: 0,
               useNativeDriver: true,
               tension: 100,
               friction: 8,
            } ),
            Animated.timing( opacityAnim, {
               toValue: 1,
               duration: 300,
               useNativeDriver: true,
            } ),
            Animated.spring( scaleAnim, {
               toValue: 1,
               useNativeDriver: true,
               tension: 100,
               friction: 8,
            } ),
         ] ).start()
      }
   }, [ isNew, slideAnim, opacityAnim, scaleAnim ] )

   return (
      <Animated.View
         style={[
            styles.container,
            {
               alignSelf: message.isUser ? "flex-end" : "flex-start",
               flexDirection: message.isUser ? "row" : "row",
               transform: [ { translateY: slideAnim }, { scale: scaleAnim } ],
               opacity: opacityAnim,
               width: message.type === "voice" ? "100%" : "auto",
            },
         ]}
      >
         {!message.isUser && (
            <View style={[ styles.avatar, { backgroundColor: Colors[ them ].primary } ]}>
               <Ionicons name="sparkles" size={14} color="#fff" />
            </View>
         )}
         <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={() => {
               if ( message.type === "text" ) {
                  handleCopy( message.text )
               }
            }}
            style={{ flex: message.type === "voice" ? 1 : undefined, flexShrink: 1 }}
         >
            <View
               style={[
                  styles.bubble,
                  {
                     backgroundColor: colors.backgroundColor,
                     marginLeft: message.isUser ? 60 : 0,
                     marginRight: message.isUser ? 0 : 40,
                     shadowColor: message.isUser ? Colors[ them ].primary : "#000",
                     shadowOpacity: 0.15,
                     shadowRadius: 8,
                     shadowOffset: { width: 0, height: 2 },
                     elevation: 3,
                  },
               ]}
            >
               {message.type === "text" ? (
                  <Text
                     style={[
                        styles.text,
                        { color: colors.textColor },
                     ]}
                  >
                     {message.text}
                  </Text>
               ) : (
                  <AudioMsg message={message} audioUri={message.audioUri} />
               )}

               <Text
                  style={[
                     styles.timestamp,
                     { color: colors.timestampColor },
                  ]}
               >
                  {formattedTime}
               </Text>
            </View>
         </TouchableOpacity>
      </Animated.View>
   )
} )

const styles = StyleSheet.create( {
   container: {
      marginVertical: 6,
      paddingHorizontal: 16,
      maxWidth: '85%',
   },
   bubble: {
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 10,
   },
   text: {
      fontSize: 16,
      lineHeight: 22,
      marginBottom: 4,
   },
   timestamp: {
      fontSize: 12,
      textAlign: "right",
   },
   avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      marginTop: 4,
   },
} )
