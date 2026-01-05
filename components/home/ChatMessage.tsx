import { Colors } from "@/constants/theme"
import { handleCopy } from "@/functions/helper"
import { useMainContext } from "@/providers/MainProvider"
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
         ] ).start()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [ isNew ] )

   return (
      <Animated.View
         style={[
            styles.container,
            {
               alignSelf: message.isUser ? "flex-end" : "flex-start",
               transform: [ { translateY: slideAnim } ],
               opacity: opacityAnim,
               width: message.type === "voice" ? "100%" : "auto",
            },
         ]}
      >
         <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={() => {
               if ( message.type === "text" ) {
                  handleCopy( message.text )
               }
            }}
         >
            <View
               style={[
                  styles.bubble,
                  {
                     backgroundColor: colors.backgroundColor,
                     marginLeft: message.isUser ? 60 : 0,
                     marginRight: message.isUser ? 0 : 60,
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
      marginVertical: 4,
      paddingHorizontal: 16,
   },
   bubble: {
      borderRadius: 18,
      paddingHorizontal: 16,
      paddingVertical: 10,
      maxWidth: "80%",
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
} )
