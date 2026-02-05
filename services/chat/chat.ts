import { api, uploadApi } from '@/shared/lib/axios'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface ChatMessage {
   id: string
   role: 'customer' | 'ai'
   message: string
   type: 'text' | 'voice'
   audioUrl?: string | null
   createdAt: string
}

export interface ChatHistoryResponse {
   chatId: string
   messages: ChatMessage[]
   hasMore: boolean
   page: number
   limit: number
}

export interface ChatMetaResponse {
   chatId: string
   messageCount: number
   summary?: string
}

export interface ChatResponse {
   reply: string
   audioData?: string
}

export const chatApi = {
   getHistory: async ( limit: number = 20, page: number = 1, userId?: string | number ): Promise<ChatHistoryResponse> => {
      const { data } = await api.get<ChatHistoryResponse>( `/chat/history?limit=${limit}&page=${page}` )
      return data
   },
   getMeta: async (): Promise<ChatMetaResponse> => {
      const { data } = await api.get<ChatMetaResponse>( "/chat/meta" )
      return data
   },

   sendMessage: async ( message: string, type: 'text' | 'voice' = 'text' ): Promise<ChatResponse> => {
      const { data } = await api.post<ChatResponse>( '/chat', { message, type } )
      return data
   },

   sendVoiceMessage: async ( uri: string ): Promise<{ success: boolean, transcription: string }> => {
      const formData = new FormData()
      const normalizedUri = uri.startsWith( 'file://' ) ? uri : `file://${uri}`
      formData.append( 'file', {
         uri: normalizedUri,
         type: 'audio/m4a',
         name: 'voice.m4a',
      } as any )
      const { data } = await uploadApi.post<{ success: boolean, transcription: string }>( '/voice', formData )
      return data
   },

   transcribeVoice: async ( uri: string ): Promise<string> => {
      const formData = new FormData()
      const normalizedUri = uri.startsWith( 'file://' ) ? uri : `file://${uri}`
      formData.append( 'file', {
         uri: normalizedUri,
         type: 'audio/m4a',
         name: 'voice.m4a',
      } as any )
      const { data } = await uploadApi.post<{ success: boolean, transcription: string }>( '/voice?transcribeOnly=true', formData )
      if ( !data.success || !data.transcription ) {
         throw new Error( 'Transcription failed' )
      }
      return data.transcription
   },
}

const getErrorMessage = ( error: any ): string => {
   if ( error?.response?.data?.error ) {
      return error.response.data.error
   }
   if ( error?.response?.status === 401 ) {
      return 'Giriş etməlisiniz.'
   }
   if ( error?.response?.status === 400 ) {
      return error?.response?.data?.error || 'Yanlış məlumatlar daxil edilib'
   }
   if ( error?.response?.status === 429 ) {
      return error?.response?.data?.error || 'Mesaj limitinə çatdınız. Maksimum 5 mesaj göndərə bilərsiniz.'
   }
   if ( error?.response?.status >= 500 ) {
      return 'Server xətası baş verdi'
   }
   return 'Xəta baş verdi'
}

export const useChatHistory = ( userId?: string | number ) => {
   return useInfiniteQuery( {
      queryKey: [ 'chat', 'history', userId ],
      queryFn: ( { pageParam = 1 }: { pageParam?: number } ) => chatApi.getHistory( 20, pageParam, userId ),
      initialPageParam: 1,
      getNextPageParam: ( lastPage: ChatHistoryResponse, allPages ) => {
         return lastPage.hasMore ? allPages.length + 1 : undefined
      },
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      enabled: !!userId,
   } )
}

export const useChatMeta = ( userId?: string | number ) => {
   return useInfiniteQuery( {
      queryKey: [ 'chat', 'meta', userId ],
      queryFn: () => chatApi.getMeta(),
      initialPageParam: 1,
      enabled: !!userId,
      retry: 1,
      getNextPageParam: () => undefined,
   } )
}

export const useSendMessage = ( userId?: string | number ) => {
   const queryClient = useQueryClient()

   return useMutation( {
      mutationFn: ( { message, type }: { message: string; type?: 'text' | 'voice' } ) =>
         chatApi.sendMessage( message, type ),

      onMutate: async ( { message, type = 'text' } ) => {
         await queryClient.cancelQueries( { queryKey: [ 'chat', 'history', userId ] } )

         const previousData = queryClient.getQueryData<{ pages: { messages: ChatMessage[] }[] }>(
            [ 'chat', 'history', userId ]
         )

         const optimisticMessage: ChatMessage = {
            id: `optimistic-${Date.now()}`,
            role: 'customer',
            message,
            type,
            createdAt: new Date().toISOString(),
         }

         queryClient.setQueryData<{ pages: { messages: ChatMessage[], chatId: string, hasMore: boolean, page: number, limit: number }[], pageParams: number[] }>(
            [ 'chat', 'history', userId ],
            ( old ) => {
               if ( !old || !old.pages || !old.pages.length ) {
                  return {
                     pages: [ {
                        chatId: 'temp-id',
                        messages: [ optimisticMessage ],
                        hasMore: false,
                        page: 1,
                        limit: 20
                     } ],
                     pageParams: [ 1 ]
                  } as any
               }

               const newPages = [ ...old.pages ]
               const lastPageIndex = newPages.length - 1
               const lastPage = newPages[ lastPageIndex ]

               newPages[ lastPageIndex ] = {
                  ...lastPage,
                  messages: [ ...lastPage.messages, optimisticMessage ],
               }

               return { ...old, pages: newPages }
            }
         )

         return { previousData }
      },

      onSuccess: ( data ) => {
         if ( data.reply ) {
            const aiMessage: ChatMessage = {
               id: `ai-${Date.now()}`,
               role: 'ai',
               message: data.reply,
               type: 'text',
               createdAt: new Date().toISOString(),
            }

            queryClient.setQueryData<{ pages: { messages: ChatMessage[] }[] }>(
               [ 'chat', 'history', userId ],
               ( old ) => {
                  if ( !old?.pages?.length ) return old
                  const newPages = [ ...old.pages ]
                  const lastPageIndex = newPages.length - 1
                  const lastPage = newPages[ lastPageIndex ]

                  newPages[ lastPageIndex ] = {
                     ...lastPage,
                     messages: [ ...lastPage.messages, aiMessage ],
                  }
                  return { ...old, pages: newPages }
               }
            )
         }

         queryClient.invalidateQueries( { queryKey: [ 'chat', 'history', userId ] } )
      },

      onError: ( _error, _variables, context ) => {
         if ( context?.previousData ) {
            queryClient.setQueryData( [ 'chat', 'history', userId ], context.previousData )
         }
      },
   } )
}

export const useSendVoiceMessage = () => {
   const queryClient = useQueryClient()

   return useMutation( {
      mutationFn: ( uri: string ) => chatApi.sendVoiceMessage( uri ),
      onSuccess: () => {
         queryClient.invalidateQueries( {
            queryKey: [ 'chat', 'history' ],
            refetchType: 'active'
         } )

         setTimeout( () => {
            queryClient.invalidateQueries( {
               queryKey: [ 'chat', 'history' ],
               refetchType: 'active'
            } )
         }, 5000 )
      },
      onError: ( error ) => {
         throw new Error( getErrorMessage( error ) )
      },
   } )
}

export const useTranscribeVoice = () => {
   return useMutation( {
      mutationFn: ( uri: string ) => chatApi.transcribeVoice( uri ),
      onError: ( error ) => {
         throw new Error( getErrorMessage( error ) )
      },
   } )
}
