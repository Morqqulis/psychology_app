import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { AudioModule, AudioRecorder, RecorderState, setAudioModeAsync } from 'expo-audio'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, Animated, StyleSheet, Text, View } from 'react-native'

interface VoiceRecordingProps {
   onCancel: () => void
   recorder: AudioRecorder
   recorderState: RecorderState
}

const requestPermissions = async () => {
   const perm = await AudioModule.requestRecordingPermissionsAsync()
   if ( !perm.granted ) {
      Alert.alert( 'Xəta', 'Mikrofona icazə verməlisiniz!' )
      return false
   }

   await setAudioModeAsync( {
      allowsRecording: true,
      playsInSilentMode: true,
   } )
   return true
}

export function VoiceRecording( { onCancel, recorder, recorderState }: VoiceRecordingProps ) {
   const { them } = useMainContext()
   const [ duration, setDuration ] = useState( 0 )
   const pulseAnim = useRef( new Animated.Value( 1 ) ).current
   const intervalRef = useRef<number | null>( null )

   useEffect( () => {
      const id = setInterval( () => {
         setDuration( prev => prev + 1 )
      }, 1000 )
      intervalRef.current = typeof id === "number" ? id : null

      const pulse = Animated.loop(
         Animated.sequence( [
            Animated.timing( pulseAnim, {
               toValue: 1.2,
               duration: 800,
               useNativeDriver: true,
            } ),
            Animated.timing( pulseAnim, {
               toValue: 1,
               duration: 800,
               useNativeDriver: true,
            } ),
         ] ),
      )
      pulse.start()

      return () => {
         if ( intervalRef.current ) {
            clearInterval( intervalRef.current )
            intervalRef.current = null
         }
         pulse.stop()
         if ( recorderState.isRecording ) {
            recorder.stop().catch( console.warn )
         }
      }
   }, [ pulseAnim, recorder, recorderState.isRecording ] )

   const startRecord = useCallback( async () => {
      if ( !recorderState.isRecording ) {
         await recorder.prepareToRecordAsync()
         recorder.record()
      }
   }, [ recorder, recorderState.isRecording ] )

   useEffect( () => {
      const init = async () => {
         const r = await requestPermissions()
         if ( r ) {
            await startRecord()
         }
      }
      init()

      return () => {
         if ( intervalRef.current ) {
            clearInterval( intervalRef.current )
            intervalRef.current = null
         }
      }
   }, [ startRecord ] )

   useEffect( () => {
      if ( !recorderState.isRecording && intervalRef.current ) {
         clearInterval( intervalRef.current )
         intervalRef.current = null
      }
   }, [ recorderState.isRecording ] )

   const formatDuration = ( seconds: number ) => {
      const mins = Math.floor( seconds / 60 )
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart( 2, '0' )}`
   }

   return (
      <View style={[ styles.container, { backgroundColor: `${Colors[ them ].error}14`, borderColor: Colors[ them ].error } ]}>
         <Animated.View
            style={[
               styles.recordingDot,
               {
                  backgroundColor: Colors[ them ].error,
                  transform: [ { scale: pulseAnim } ],
               },
            ]}
         />
         <Text style={[ styles.recordingText, { color: Colors[ them ].error } ]}>
            {formatDuration( duration )}
         </Text>
      </View>
   )
}
const styles = StyleSheet.create( {
   container: {
      maxHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 16,
      borderWidth: 1,
   },
   recordingDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
   },
   recordingText: {
      fontSize: 15,
      fontWeight: '600',
   },
} )
