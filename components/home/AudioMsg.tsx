import { Ionicons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"
import { AudioStatus, useAudioPlayer, useAudioPlayerStatus } from "expo-audio"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface IAudioMsgProps {
   message: {
      id: string
      text: string
      isUser: boolean
      type: "text" | "voice"
      timestamp: Date
      audioUri?: string
   }
   audioUri?: string
}

export default function AudioMsg( { message, audioUri }: IAudioMsgProps ) {
   const audioSource = audioUri || message.text
   const [ isLoaded, setIsLoaded ] = useState( false )
   const player = useAudioPlayer( isLoaded && audioSource ? { uri: audioSource } : null )
   const status: AudioStatus = useAudioPlayerStatus( player )
   const [ isLoading, setIsLoading ] = useState( false )

   // Check if audio player is ready
   useEffect( () => {
      if ( isLoaded && audioSource ) {
         setIsLoading( true )
         // Wait a bit for the audio player to initialize
         setTimeout( () => setIsLoading( false ), 500 )
      }
   }, [ isLoaded, audioSource ] )

   // Auto-play when loaded
   useEffect( () => {
      if ( isLoaded && player && !status.playing && isLoading === false ) {
         player.play()
      }
   }, [ isLoaded, player, isLoading, status.playing ] )

   const togglePlayback = useCallback( async () => {
      if ( !isLoaded ) {
         setIsLoaded( true )
         return
      }

      if ( !player ) return

      if ( status.playing ) {
         player.pause()
      } else {
         if ( status.currentTime >= status.duration ) {
            await player.seekTo( 0 )
         }
         player.play()
      }
   }, [ player, status.playing, status.currentTime, status.duration, isLoaded ] )

   const onSeek = useCallback( async ( value: number ) => {
      if ( player ) {
         await player.seekTo( value )
      }
   }, [ player ] )

   const formatMillis = useCallback( ( millis: number ) => {
      const totalSeconds = Math.floor( millis / 1000 )
      const mins = Math.floor( totalSeconds / 60 )
      const secs = totalSeconds % 60
      return `${mins}:${secs.toString().padStart( 2, "0" )}`
   }, [] )

   // Memoize formatted times to prevent unnecessary re-renders
   const currentTimeFormatted = useMemo( () =>
      formatMillis( status.currentTime ), [ status.currentTime, formatMillis ] )

   const durationFormatted = useMemo( () =>
      formatMillis( status.duration ), [ status.duration, formatMillis ] )

   const isDisabled = ( isLoaded && ( !player || isLoading ) )
   const iconName = ( isLoaded && status.playing ) ? "pause" : "play"

   return (
      <View style={styles.audioContainer}>
         <TouchableOpacity onPress={togglePlayback} disabled={isDisabled}>
            <Ionicons
               name={iconName}
               size={24}
               color={isDisabled ? "rgba(255,255,255,0.3)" : ( message.isUser ? "#fff" : "#000" )}
            />
         </TouchableOpacity>
         <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={status.duration || 0}
            value={status.currentTime}
            minimumTrackTintColor={message.isUser ? "#fff" : "#000"}
            maximumTrackTintColor="rgba(0,0,0,0.3)"
            onSlidingComplete={onSeek}
            disabled={isDisabled}
         />
         <Text
            style={{
               color: message.isUser ? "#fff" : "#000",
               fontSize: 12,
               marginLeft: 5,
            }}
         >
            {currentTimeFormatted} / {durationFormatted}
         </Text>
      </View>
   )
}

const styles = StyleSheet.create( {
   audioContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   slider: {
      flex: 1,
   },
} )
