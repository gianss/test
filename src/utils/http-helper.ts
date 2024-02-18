import { HttpResponse } from '@/models/http-response'

export const badRequest = (error: any): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (message?: string): HttpResponse => ({
  statusCode: 401,
  body: message || 'Você não tem autorização'
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: 'Error de servidor'
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
