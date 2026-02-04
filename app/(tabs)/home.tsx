import {
   ChatHeader,
   ChatInput,
   ChatMessage,
   LimitMessage,
   ScrollToBottomButton,
   TypingIndicator,
} from '@/components/home'
import { ChatSkeleton } from '@/components/ui/skeleton'
import { Colors } from '@/constants/theme'
import { showToast } from '@/hooks/useToast'
import { useMainContext } from '@/providers/MainProvider'
import { useProfile } from '@/services/auth/auth'
import { ChatMessage as ServiceChatMessage, useChatHistory, useChatMeta, useSendMessage } from '@/services/chat/chat'
import { startEpointPayment } from '@/services/payments/epoint'
import { useSettings } from '@/services/settings/settings'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet, View } from 'react-native'

interface Message {
   id: string
   text: string
   isUser: boolean
   timestamp: Date
   type: "text" | "voice"
   audioUri?: string
}



export default function ChatScreen() {
   const { them } = useMainContext()
   const [ isTyping, setIsTyping ] = useState( false )
   const [ isAtBottom, setIsAtBottom ] = useState( true )
   const [ isPaying, setIsPaying ] = useState( false )
   const flashListRef = useRef<React.ElementRef<typeof FlashList<Message>>>( null )
   const prevMessagesLengthRef = useRef( 0 )

   const profile = useProfile()
   const { data: settings } = useSettings()
   const userId = profile.data?.user?.id
   const { data: chatHistory, isLoading: historyLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchHistory } = useChatHistory( userId )
   const { data: chatMeta, refetch: refetchChatMeta } = useChatMeta( userId )
   const sendMessage = useSendMessage( userId )
   const user = profile.data?.user
   const isVip = user?.status === "vip"
   const invitedCount = user?.invitedCount ?? 0
   const [ usedLocal, setUsedLocal ] = useState<number | undefined>( undefined )
   const serverUsed = chatMeta?.pages?.[ 0 ]?.messageCount ?? user?.totalMessagesUsed ?? 0
   const used = usedLocal ?? serverUsed
   const bonus = Math.floor( invitedCount / 5 ) * 5
   const freeLimit = settings?.freeMessageLimit ?? 5
   const maxFree = freeLimit + bonus
   const remaining = Math.max( 0, maxFree - used )

   const isReady = !profile.isLoading && !!userId

   useEffect( () => {
      setIsAtBottom( true )
      flashListRef.current?.scrollToOffset( { animated: false, offset: 0 } )
      setUsedLocal( undefined )
   }, [ userId ] )

   useEffect( () => {
      if ( typeof serverUsed === "number" ) {
         setUsedLocal( serverUsed )
      }
   }, [ serverUsed ] )

   const messages = useMemo( (): Message[] => {
      if ( !chatHistory?.pages ) return []

      const allMessages = chatHistory.pages.flatMap( page =>
         page.messages.map( ( msg: ServiceChatMessage ) => ( {
            id: msg.id.toString(),
            text: msg.message,
            isUser: msg.role === 'customer',
            type: msg.type,
            timestamp: new Date( msg.createdAt ),
            audioUri: undefined,
         } ) )
      )

      if ( allMessages.length === 0 && !historyLoading ) {
         return [ {
            id: "welcome",
            text: "Salam! Mən Nur Yolu assistentiyəm. Sizə necə kömək edə bilərəm? İstədiyiniz hər şeyi mənə soruşa bilərsiniz.",
            isUser: false,
            type: "text",
            timestamp: new Date(),
         } ]
      }

      return allMessages
   }, [ chatHistory, historyLoading ] )

   useEffect( () => {
      const currentLength = messages.length
      const prevLength = prevMessagesLengthRef.current
      prevMessagesLengthRef.current = currentLength

      if ( currentLength > prevLength && isAtBottom ) {
         setTimeout( () => {
            flashListRef.current?.scrollToEnd( { animated: currentLength - prevLength === 1 } )
         }, 50 )
      }
   }, [ messages.length, isAtBottom ] )

   useEffect( () => {
      if ( messages.length > 0 && !historyLoading ) {
         setTimeout( () => {
            flashListRef.current?.scrollToEnd( { animated: false } )
            setIsAtBottom( true )
         }, 300 )
      }
   }, [ messages.length, historyLoading ] )

   const handleSendMessage = async ( text: string ) => {
      if ( !text?.trim() ) return

      setIsTyping( true )
      setUsedLocal( prev => ( prev ?? serverUsed ) + 1 )

      try {
         await sendMessage.mutateAsync( { message: text } )
         refetchChatMeta().catch( () => { } )
      } catch {
         setUsedLocal( prev => Math.max( 0, ( prev ?? serverUsed ) - 1 ) )
         showToast( {
            title: "Xəta",
            message: "Mesaj göndərilərkən xəta baş verdi. İnternet bağlantınızı yoxlayın",
            type: "error",
         } )
      } finally {
         setIsTyping( false )
      }
   }

   const renderMessage = useCallback(
      ( { item, index }: { item: Message; index: number } ) => (
         <ChatMessage message={item} isNew={index === messages.length - 1} />
      ),
      [ messages.length ]
   )

   // Temporarily remove getItemLayout to see if it's causing scrolling issues
   // const getItemLayout = useMemo(() => (data: any, index: number) => ({
   //    length: 80, // Approximate height of each message
   //    offset: 80 * index,
   //    index,
   // }), [])

   const handleScroll = useCallback( ( event: NativeSyntheticEvent<NativeScrollEvent> ) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
      // Use a more generous threshold for "at bottom"
      const distanceFromBottom = contentSize.height - contentOffset.y - layoutMeasurement.height
      setIsAtBottom( distanceFromBottom < 100 ) // Within 100px of bottom
   }, [] )

   const renderFooter = () => {
      if ( isTyping ) {
         return <TypingIndicator />
      }
      return null
   }

   const handleUpgrade = async () => {
      if ( isPaying ) return
      try {
         setIsPaying( true )
         const orderId = `mobile-${Date.now()}`
         const paymentAmount = settings?.paymentAmount ?? 5
         await startEpointPayment( {
            amount: paymentAmount,
            orderId,
            description: "AI limitsiz istifadə üçün ödəniş",
         } )
      } catch ( error ) {
         console.error( error )

         showToast( {
            title: "Ödəniş",
            message: "Ödəniş baş tutmadı, yenidən cəhd edin",
            type: "error",
         } )
      } finally {
         setIsPaying( false )
      }
   }

   if ( !isReady || historyLoading ) {
      return (
         <View style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}>
            <ChatHeader />
            <ChatSkeleton />
            <ChatInput onSendMessage={() => { }} disabled={true} />
         </View>
      )
   }

   return (
      <View style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}>
         <ChatHeader />

         <View style={{ flex: 1 }}>
            <FlashList
               ref={flashListRef}
               data={messages}
               renderItem={renderMessage}
               keyExtractor={( item ) => item.id}
               // @ts-ignore
               estimatedItemSize={100}
               onEndReachedThreshold={0.2}
               ListFooterComponent={renderFooter}
               onScroll={handleScroll}
               scrollEventThrottle={16}
               onTouchStart={() => Keyboard.dismiss()}
               onEndReached={() => {
                  if ( hasNextPage && !isFetchingNextPage ) {
                     fetchNextPage()
                  }
               }}
               contentContainerStyle={styles.messagesContainer}
               showsVerticalScrollIndicator={false}
               keyboardShouldPersistTaps="handled"
               refreshControl={
                  <RefreshControl
                     refreshing={false}
                     onRefresh={() => {
                        refetchHistory()
                        refetchChatMeta()
                     }}
                     tintColor={Colors[ them ].primary}
                  />
               }
            />
            <ScrollToBottomButton
               visible={!isAtBottom}
               onPress={() => {
                  flashListRef.current?.scrollToOffset( {
                     offset: 999999,
                     animated: true,
                  } )
               }}
            />
         </View>

         <ChatInput onSendMessage={handleSendMessage} disabled={isTyping || sendMessage.isPending || ( remaining === 0 && !isVip )} />

         {remaining === 0 && !isVip && (
            <LimitMessage
               onUpgrade={handleUpgrade}
               isPaying={isPaying}
               paymentAmount={settings?.paymentAmount ?? 5}
            />
         )}
      </View>
   )
}

const styles = StyleSheet.create( {
   container: {
      flex: 1,
   },
   chatContainer: {},
   messagesList: {
      flex: 1,
   },
   messagesContainer: {
      paddingVertical: 16,
      flexGrow: 1,
   },
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
} )
