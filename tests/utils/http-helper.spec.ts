import { unauthorized } from '@/utils/http-helper'

describe('HTTP Helper unauthorized', () => {
    test('should return a default message when no message parameter is provided', () => {
        const result = unauthorized()
        expect(result.body).toEqual('Você não tem autorização')
    })

    test('should return the provided message when a message parameter is provided', () => {
        const message = 'Test message'
        const result = unauthorized(message)
        expect(result.body).toEqual(message)
    })
})
