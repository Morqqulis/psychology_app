import * as Linking from "expo-linking"

import api from "@/shared/lib/axios"

interface CreatePaymentInput {
  amount: number
  orderId: string
  description?: string
}

interface CreatePaymentResponse {
  status?: string
  redirectUrl?: string
  transaction?: unknown
}

export const startEpointPayment = async (input: CreatePaymentInput) => {
  const response = await api.post<CreatePaymentResponse>("/api/payments/epoint/create", {
    amount: input.amount,
    orderId: input.orderId,
    description: input.description,
  })

  if (!response.data.redirectUrl) {
    throw new Error("Redirect URL is missing")
  }

  await Linking.openURL(response.data.redirectUrl)
  return response.data
}

