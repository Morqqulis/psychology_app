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
import { useChatHistory, useChatMeta, useSendMessage } from '@/services/chat/chat'
import { startEpointPayment } from '@/services/payments/epoint'
import { useSettings } from '@/services/settings/settings'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, RefreshControl, StyleSheet, View } from 'react-native'

interface Message {
   id: string
   text: string
   isUser: boolean
   timestamp: Date
   type: "text" | "voice"
   audioUri?: string
}

interface ChatHistoryMessage {
   id: string | number
   role: 'customer' | 'ai'
   message: string
   type: 'text' | 'voice'
   createdAt: string
}

export default function ChatScreen() {
   const { them } = useMainContext()
   const [ localMessages, setLocalMessages ] = useState<Message[]>( [] )
   const [ isTyping, setIsTyping ] = useState( false )
   const [ isAtBottom, setIsAtBottom ] = useState( true )
   const [ isPaying, setIsPaying ] = useState( false )
   const flatListRef = useRef<FlatList<Message>>( null )

   const profile = useProfile()
   const { data: settings } = useSettings()
   const userId = profile.data?.user.id
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

   useEffect( () => {
      setLocalMessages( [] )
      setIsAtBottom( true )
      flatListRef.current?.scrollToOffset( { animated: false, offset: 0 } )
      setUsedLocal( undefined )
   }, [ userId ] )

   useEffect( () => {
      if ( typeof serverUsed === "number" ) {
         setUsedLocal( serverUsed )
      }
   }, [ serverUsed ] )

   const processedMessages = useMemo( () => {
      if ( chatHistory?.pages ) {
         const allMessages = chatHistory.pages.flatMap( page =>
            page.messages.map( ( msg: ChatHistoryMessage ) => ( {
               id: msg.id.toString(),
               text: msg.message,
               isUser: msg.role === 'customer',
               type: msg.type,
               timestamp: new Date( msg.createdAt ),
               audioUri: undefined, // Will be set from local messages if available
            } ) )
         )

         if ( allMessages.length === 0 && !historyLoading ) {
            // Welcome message only if no history
            const welcomeMessage: Message = {
               id: "welcome",
               text: "Salam! Mən Nur Yolu assistentiyəm. Sizə necə kömək edə bilərəm? İstədiyiniz hər şeyi mənə soruşa bilərsiniz.",
               isUser: false,
               type: "text",
               timestamp: new Date(),
            }
            return [ welcomeMessage ]
         }
         return allMessages
      }
      return []
   }, [ chatHistory, historyLoading ] )

   useEffect( () => {
      // Only run when processedMessages actually changes
      const wasAtBottom = isAtBottom

      // Store current length before merging
      const currentLength = localMessages.length

      // Merge processed messages with local messages, preserving audioUri for voice messages
      const mergedMessages = processedMessages.map( processedMsg => {
         // Find local version that might have audioUri
         const localVersion = localMessages.find( localMsg => localMsg.id === processedMsg.id )
         if ( localVersion && localVersion.audioUri && processedMsg.type === 'voice' ) {
            // Preserve audioUri from local version for voice messages
            return { ...processedMsg, audioUri: localVersion.audioUri }
         }
         return processedMsg
      } )

      // Add any local messages that aren't in processed messages (newly sent, not yet saved)
      const newLocalMessages = localMessages.filter( localMsg =>
         !mergedMessages.some( mergedMsg => mergedMsg.id === localMsg.id )
      )

      const finalMessages = [ ...mergedMessages, ...newLocalMessages ]
      setLocalMessages( finalMessages )

      // If user was at bottom and new messages arrived, keep them at bottom
      if ( wasAtBottom && finalMessages.length > currentLength ) {
         setTimeout( () => {
            flatListRef.current?.scrollToEnd( { animated: false } )
         }, 100 )
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [ processedMessages, isAtBottom ] ) // Only depend on processedMessages and isAtBottom

   // Initial scroll when component mounts with messages
   useEffect( () => {
      if ( processedMessages.length > 0 && !historyLoading ) {
         // Use a longer timeout to ensure FlatList is fully rendered
         setTimeout( () => {
            flatListRef.current?.scrollToEnd( { animated: false } )
            setIsAtBottom( true ) // Assume user is at bottom initially
         }, 300 )
      }
   }, [ processedMessages.length, historyLoading ] )

   // Scroll to bottom for newly sent messages (only if user is at bottom)
   useEffect( () => {
      if ( localMessages.length > 0 && !historyLoading && isAtBottom ) {
         // Check if the last message is new (within last 3 seconds)
         const lastMessage = localMessages[ localMessages.length - 1 ]
         if ( lastMessage && lastMessage.timestamp.getTime() > Date.now() - 3000 ) {
            setTimeout( () => {
               flatListRef.current?.scrollToEnd( { animated: true } )
            }, 100 )
         }
      }
   }, [ localMessages, historyLoading, isAtBottom ] )

   const generateMsg = ( text: string, isVoice: boolean, isUser: boolean, audioUri?: string ): Message => {
      const message: Message = {
         id: `${Math.floor( Math.random() * 10000 ).toString()}${isUser ? "_user" : "_ai"}`,
         type: isVoice ? "voice" : "text",
         text,
         isUser,
         timestamp: new Date(),
         audioUri,
      }
      setLocalMessages( ( prev ) => [ ...prev, message ] )
      return message
   }

   const handleSendMessage = async ( text: string ) => {
      if ( !text?.trim() ) return

      try {
         setIsTyping( true )

         generateMsg( text, false, true )
         const response = await sendMessage.mutateAsync( { message: text } )
         setUsedLocal( prev => ( prev ?? serverUsed ) + 1 )
         refetchChatMeta().catch( () => { } )
         if ( response.reply ) {
            generateMsg( response.reply, false, false )
         }
      } catch ( error: any ) {
         const errorMessage = error?.message || 'Mesajınızı əldə edə bilmədim. Zəhmət olmasa yenidən cəhd edin'
         showToast( {
            title: "Xəta",
            message: errorMessage,
            type: "error",
         } )
         setLocalMessages( prev => prev.filter( msg => !msg.id.includes( '_user' ) ) )
      } finally {
         setIsTyping( false )
      }
   }

   const renderMessage = useCallback(
      ( { item, index }: { item: Message; index: number } ) => (
         <ChatMessage message={item} isNew={index === localMessages.length - 1} />
      ),
      [ localMessages.length ]
   )

   // Temporarily remove getItemLayout to see if it's causing scrolling issues
   // const getItemLayout = useMemo(() => (data: any, index: number) => ({
   //    length: 80, // Approximate height of each message
   //    offset: 80 * index,
   //    index,
   // }), [])

   const handleScroll = useCallback( ( event: any ) => {
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

   if ( historyLoading ) {
      return (
         <View style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}>
            <ChatHeader />
            <ChatSkeleton />
            <ChatInput onSendMessage={handleSendMessage} disabled={true} />
         </View>
      )
   }

   return (
      <KeyboardAvoidingView
         style={[ styles.container, { backgroundColor: Colors[ them ].background } ]}
         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
         <ChatHeader />

         <View style={{ flex: 1 }}>
            <FlatList
               ref={flatListRef}
               data={localMessages}
               renderItem={renderMessage}
               keyExtractor={( item ) => item.id}
               initialNumToRender={12}
               maxToRenderPerBatch={8}
               windowSize={9}
               removeClippedSubviews
               updateCellsBatchingPeriod={60}
               onEndReachedThreshold={0.2}
               ListFooterComponent={renderFooter}
               onScroll={handleScroll}
               scrollEventThrottle={16}
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
                  flatListRef.current?.scrollToOffset( {
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
      </KeyboardAvoidingView>
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
