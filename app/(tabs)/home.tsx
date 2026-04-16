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
import { useSettings } from '@/services/settings/settings'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet, View, FlatList } from 'react-native'

interface Message {
   id: string
   text: string
   isUser: boolean
   timestamp: Date
   type: "text" | "voice"
   audioUri?: string
}

const createClientMessageId = () =>
   `msg-${Date.now()}-${Math.random().toString( 36 ).slice( 2, 10 )}`



export default function ChatScreen() {
   const { them } = useMainContext()
   const [ isTyping, setIsTyping ] = useState( false )
   const [ isAtBottom, setIsAtBottom ] = useState( true )
   const flashListRef = useRef<FlatList<Message>>( null )
   const prevMessagesLengthRef = useRef( 0 )
   const sendInFlightRef = useRef( false )

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
   const freeLimit = settings?.freeMessageLimit ?? 5
   const referralInviteStep = settings?.referralInviteStep && settings.referralInviteStep > 0 ? settings.referralInviteStep : 5
   const referralMessageBonus = settings?.referralMessageBonus && settings.referralMessageBonus > 0 ? settings.referralMessageBonus : 5
   const bonus = Math.floor( invitedCount / referralInviteStep ) * referralMessageBonus
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
            flashListRef.current?.scrollToOffset( { offset: 0, animated: currentLength - prevLength === 1 } )
         }, 50 )
      }
   }, [ messages.length, isAtBottom ] )

   useEffect( () => {
      if ( messages.length > 0 && !historyLoading ) {
         setIsAtBottom( true )
      }
   }, [ messages.length, historyLoading ] )

   const handleSendMessage = async ( text: string ) => {
      if ( !text?.trim() || sendInFlightRef.current ) return
      sendInFlightRef.current = true

      setIsTyping( true )
      setUsedLocal( prev => ( prev ?? serverUsed ) + 1 )

      try {
         await sendMessage.mutateAsync( {
            message: text,
            clientMessageId: createClientMessageId(),
         } )
         refetchChatMeta().catch( () => { } )
      } catch {
         await Promise.allSettled( [ refetchHistory(), refetchChatMeta() ] )
         setUsedLocal( undefined )
         showToast( {
            title: "Xəta",
            message: "Mesaj göndərilərkən xəta baş verdi. İnternet bağlantınızı yoxlayın",
            type: "error",
         } )
      } finally {
         setIsTyping( false )
         sendInFlightRef.current = false
      }
   }

   const renderMessage = useCallback(
      ( { item, index }: { item: Message; index: number } ) => (
         <ChatMessage message={item} isNew={index === 0} />
      ),
      []
   )

   // Temporarily remove getItemLayout to see if it's causing scrolling issues
   // const getItemLayout = useMemo(() => (data: any, index: number) => ({
   //    length: 80, // Approximate height of each message
   //    offset: 80 * index,
   //    index,
   // }), [])

   const handleScroll = useCallback( ( event: NativeSyntheticEvent<NativeScrollEvent> ) => {
      const { contentOffset } = event.nativeEvent
      setIsAtBottom( contentOffset.y < 100 ) // Within 100px of bottom in inverted list
   }, [] )

   const renderTypingIndicator = () => {
      if ( isTyping ) {
         return <TypingIndicator />
      }
      return null
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
            <FlatList
               ref={flashListRef}
               data={messages}
               inverted={true}
               renderItem={renderMessage}
               keyExtractor={( item ) => item.id}
               onEndReachedThreshold={0.2}
               ListHeaderComponent={renderTypingIndicator}
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
                     offset: 0,
                     animated: true,
                  } )
               }}
            />
         </View>

         <ChatInput onSendMessage={handleSendMessage} disabled={isTyping || sendMessage.isPending || ( remaining === 0 && !isVip )} />

         {remaining === 0 && !isVip && (
            <LimitMessage />
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
