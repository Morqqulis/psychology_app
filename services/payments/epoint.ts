import api from "@/shared/lib/axios"
import * as Linking from "expo-linking"

interface CreatePaymentInput {
   amount: number
   description?: string
   productType?: 'subscription' | 'appointment'
   specialistId?: string | number
}

interface CreatePaymentResponse {
   status?: string
   redirectUrl?: string
   transaction?: unknown
}

export const startEpointPayment = async ( input: CreatePaymentInput ) => {
   const response = await api.post<CreatePaymentResponse>( "/payments/epoint/create", {
      amount: input.amount,
      description: input.description,
      productType: input.productType,
      specialistId: input.specialistId,
   } )

   if ( !response.data.redirectUrl ) {
      throw new Error( "Redirect URL is missing" )
   }

   await Linking.openURL( response.data.redirectUrl )
   return response.data
}
