import { Tabs } from 'expo-router'
import React from 'react'
import { HapticTab } from '@/components/ui/haptic-tab'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Colors } from '@/constants/theme'
import { useMainContext } from '@/providers/MainProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native'

export default function TabLayout() {
	const { them } = useMainContext()
	return (
		<SafeAreaView style={{ flex: 1 }} edges={['top']}>
			<Tabs
				screenOptions={{
					tabBarShowLabel: true,
					tabBarActiveTintColor: Colors[them].tint,
					tabBarInactiveTintColor: Colors[them].tabIconDefault,
					// tabBarHideOnKeyboard: true,

					tabBarBackground: () => (
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
								borderColor: 'none',
								backgroundColor: '#2c3e50',
							}}>
							<View style={{}} />
						</View>
					),
					tabBarLabelStyle: {
						fontSize: 11,
					},

					tabBarLabelPosition: 'below-icon',
					headerShown: false,
					tabBarButton: HapticTab,
				}}>
				<Tabs.Screen
					name='home'
					options={{
						title: 'Əsas səhifə',
						tabBarIcon: ({ color }) => <IconSymbol size={28} name='house.fill' color={color} />,
					}}
				/>
				<Tabs.Screen
					name='profile'
					options={{
						title: 'Profil',
						tabBarIcon: ({ color }) => <IconSymbol size={28} name='person' color={color} />,
					}}
				/>
			</Tabs>
		</SafeAreaView>
	)
}
