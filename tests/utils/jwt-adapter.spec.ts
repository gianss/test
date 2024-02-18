import { faker } from '@faker-js/faker'
import { JwtAdapter } from '@/utils/jwt-adapter'
import { JsonWebTokenError } from 'jsonwebtoken'

const makeSut = (): JwtAdapter => {
    return new JwtAdapter()
}

describe('JwtAdapter', () => {
    test('should return a string when token generation is successful', () => {
        const sut = makeSut()
        const result = sut.generateToken({ id: faker.string.uuid() })
        expect(typeof result).toEqual('string')
    })

    test('should return an object with id property when decoding a valid token', () => {
        const sut = makeSut()
        const token = sut.generateToken({ id: 'valid_id' })
        const decoded = sut.decodeToken(token)
        expect(decoded).toHaveProperty('id')
        expect(decoded.id).toEqual('valid_id')
    })

    test('should throw an error when decoding an invalid token', () => {
        const sut = makeSut()
        const invalidToken = 'invalid_token'
        expect(() => sut.decodeToken(invalidToken)).toThrow('jwt malformed')
    })

    test('should throw an error when decoding an invalid token', () => {
        const sut = makeSut()
        const invalidToken = 'invalid_token'
        expect(() => sut.decodeToken(invalidToken)).toThrow(JsonWebTokenError)
    })
})
