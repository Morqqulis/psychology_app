import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { Ionicons } from '@expo/vector-icons'
import { AudioModule, AudioRecorder, RecorderState, setAudioModeAsync } from 'expo-audio'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface VoiceRecordingProps {
	onCancel: () => void
	recorder: AudioRecorder
	recorderState: RecorderState
}

const requestPermissions = async () => {
	const perm = await AudioModule.requestRecordingPermissionsAsync()
	if (!perm.granted) {
		Alert.alert('Xəta', 'Mikrofona icazə verməlisiniz!')
		return false
	}

	await setAudioModeAsync({
		allowsRecording: true,
		playsInSilentMode: true,
	})
	return true
}

export function VoiceRecording({ onCancel, recorder, recorderState }: VoiceRecordingProps) {
	const { them } = useMainContext()
	const [duration, setDuration] = useState(0)
	const pulseAnim = useRef(new Animated.Value(1)).current

	useEffect(() => {
		const interval = setInterval(() => {
			setDuration(prev => prev + 1)
		}, 1000)

		const pulse = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.2,
					duration: 800,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
				}),
			]),
		)
		pulse.start()

		return () => {
			clearInterval(interval)
			pulse.stop()
			if (recorderState.isRecording) {
				recorder.stop().catch(console.warn)
			}
		}
	}, [])

	useEffect(() => {
		const init = async () => {
			const r = await requestPermissions()
			if (r) {
				await startRecord()
			}
		}
		init()
	}, [])

	const startRecord = async () => {
		if (!recorderState.isRecording) {
			await recorder.prepareToRecordAsync()
			recorder.record()
		}
	}

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
				<Ionicons name='close' size={24} color={Colors[them].error} />
			</TouchableOpacity>

			<Animated.View
				style={[
					styles.recordingDot,
					{
						backgroundColor: Colors[them].error,
						transform: [{ scale: pulseAnim }],
					},
				]}
			/>
			<Text style={[styles.recordingText]}>{formatDuration(duration)}</Text>
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		maxHeight: 80,
		flexDirection: 'row',
		alignItems: 'center',
	},
	cancelButton: {
		width: 35,
		height: 35,
		borderRadius: 22,
		marginRight: 15,
		justifyContent: 'center',
		alignItems: 'center',
	},
	recordingDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	recordingText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#1a1a1a',
	},
})
