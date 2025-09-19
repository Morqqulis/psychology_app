import React, { useState } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import * as Animatable from 'react-native-animatable'
import { Ionicons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRegister } from '@/services/auth/auth'

const registerSchema = z
	.object({
		name: z.string().min(2, 'Ad ən azı 2 simvoldan ibarət olmalıdır'),
		email: z.string().email('Düzgün email daxil edin'),
		password: z
			.string()
			.min(8, 'Şifrə ən azı 8 simvoldan ibarət olmalıdır')
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifrə kiçik, böyük hərflər və rəqəmlər ehtiva etməlidir'),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Şifrələr uyğun gəlmir',
		path: ['confirmPassword'],
	})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterScreen() {
	const isDark = useColorScheme() === 'dark'
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	})

	const registerMutation = useRegister()

	const onSubmit = (data: RegisterFormData) => {
		registerMutation.mutate(
			{
				name: data.name,
				email: data.email,
				password: data.password,
			},
			{
				onSuccess: () => {
					Alert.alert('Uğur', 'Hesab uğurla yaradıldı!', [{ text: 'OK', onPress: () => router.replace('/auth/login') }])
				},
				onError: (error: any) => {
					const message = error?.message || 'Hesab yaradıla bilmədi'
					Alert.alert('Xəta', message)
				},
			}
		)
	}

	return (
		<KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<LinearGradient colors={isDark ? ['#1a1a2e', '#16213e'] : ['#764ba2', '#667eea']} style={styles.gradient}>
				<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					<Animatable.View animation='fadeInUp' duration={1000} style={styles.headerContainer}>
						<View style={styles.logoContainer}>
							<Ionicons name='person-add' size={80} color='#fff' />
						</View>
						<Text style={styles.title}>Hesab yarat</Text>
						<Text style={styles.subtitle}>Bu gün bizə qoşulun</Text>
					</Animatable.View>

					<Animatable.View
						animation='fadeInUp'
						delay={300}
						duration={1000}
						style={[styles.formContainer, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}>
						<Controller
							control={control}
							name='name'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									label='Ad'
									placeholder='Adınızı daxil edin'
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
									error={errors.name?.message}
									autoCapitalize='words'
									leftIcon={<Ionicons name='person-outline' size={20} color={isDark ? '#888' : '#666'} />}
								/>
							)}
						/>

						<Controller
							control={control}
							name='email'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									label='Email'
									placeholder='Email ünvanınızı daxil edin'
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
									error={errors.email?.message}
									keyboardType='email-address'
									autoCapitalize='none'
									leftIcon={<Ionicons name='mail-outline' size={20} color={isDark ? '#888' : '#666'} />}
								/>
							)}
						/>

						<Controller
							control={control}
							name='password'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									label='Şifrə'
									placeholder='Şifrənizi daxil edin'
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
									error={errors.password?.message}
									secureTextEntry={!showPassword}
									autoComplete='password'
									textContentType='newPassword'
									leftIcon={<Ionicons name='lock-closed-outline' size={20} color={isDark ? '#888' : '#666'} />}
									rightIcon={
										<Ionicons
											name={showPassword ? 'eye-off-outline' : 'eye-outline'}
											size={20}
											color={isDark ? '#888' : '#666'}
											onPress={() => setShowPassword(!showPassword)}
										/>
									}
								/>
							)}
						/>

						<Controller
							control={control}
							name='confirmPassword'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									label='Şifrəni təsdiq edin'
									placeholder='Şifrənizi təkrar daxil edin'
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
									error={errors.confirmPassword?.message}
									secureTextEntry={!showConfirmPassword}
									autoComplete='password'
									textContentType='newPassword'
									leftIcon={<Ionicons name='lock-closed-outline' size={20} color={isDark ? '#888' : '#666'} />}
									rightIcon={
										<Ionicons
											name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
											size={20}
											color={isDark ? '#888' : '#666'}
											onPress={() => setShowConfirmPassword(!showConfirmPassword)}
										/>
									}
								/>
							)}
						/>

						<Text style={[styles.passwordHint, { color: isDark ? '#888' : '#666' }]}>
							Şifrə ən azı 8 simvol, böyük və kiçik hərflər, rəqəmlər ehtiva etməlidir
						</Text>

						<Button
							title='Hesab yarat'
							onPress={handleSubmit(onSubmit)}
							loading={registerMutation.isPending}
							style={styles.registerButton}
						/>

						<View style={styles.divider}>
							<View style={[styles.dividerLine, { backgroundColor: isDark ? '#404040' : '#e9ecef' }]} />
							<Text style={[styles.dividerText, { color: isDark ? '#888' : '#666' }]}>və ya</Text>
							<View style={[styles.dividerLine, { backgroundColor: isDark ? '#404040' : '#e9ecef' }]} />
						</View>

						<Button
							title='Google ilə qeydiyyat'
							variant='outline'
							leftIcon={<Ionicons name='logo-google' size={12} color='#667eea' />}
							style={styles.socialButton}
						/>

						<View style={styles.footer}>
							<Text style={[styles.footerText, { color: isDark ? '#888' : '#666' }]}>Artıq hesabınız var? </Text>
							<Link href='/auth/login' asChild>
								<Text style={styles.linkText}>Daxil ol</Text>
							</Link>
						</View>
					</Animatable.View>
				</ScrollView>
			</LinearGradient>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gradient: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: 20,
	},
	headerContainer: {
		alignItems: 'center',
		marginBottom: 40,
	},
	logoContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 16,
		color: 'rgba(255, 255, 255, 0.8)',
		textAlign: 'center',
	},
	formContainer: {
		borderRadius: 20,
		padding: 24,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 10,
	},
	passwordHint: {
		fontSize: 12,
		marginBottom: 16,
		lineHeight: 16,
	},
	registerButton: {
		marginTop: 8,
	},
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 24,
	},
	dividerLine: {
		flex: 1,
		height: 1,
	},
	dividerText: {
		marginHorizontal: 16,
		fontSize: 14,
	},
	socialButton: {
		marginBottom: 24,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	footerText: {
		fontSize: 14,
	},
	linkText: {
		fontSize: 14,
		color: '#667eea',
		fontWeight: '600',
	},
})
