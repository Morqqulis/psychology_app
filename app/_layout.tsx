import '@/app/global.css'
import { MainProvider } from '@/providers/MainProvider'
import { persister } from '@/shared/lib/persister'
import { queryClient } from '@/shared/lib/query-client'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { Stack } from 'expo-router'
import { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import 'react-native-reanimated'

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

const options: ExtendedStackNavigationOptions = {
   headerShown: false,
   animation: "fade",
   animationDuration: 1000,
}


export default function RootLayout() {

   return (
      <>
         <GluestackUIProvider mode='system'>
            <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
               <KeyboardProvider>
                  <MainProvider>
                     <Stack>
                        <Stack.Screen name='index' options={options} />
                        <Stack.Screen name='(tabs)' options={options} />
                        <Stack.Screen name="auth/login" options={options} />
                        <Stack.Screen name="auth/register" options={options} />
                     </Stack>
                  </MainProvider>
               </KeyboardProvider>
            </PersistQueryClientProvider>
         </GluestackUIProvider>

         <Toast topOffset={60} />

      </>
   )
}
