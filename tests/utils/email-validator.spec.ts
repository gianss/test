import { faker } from '@faker-js/faker'
import { EmailValidation } from '@/utils/email-validator'

const makeSut = (): EmailValidation => {
    return new EmailValidation()
}

describe('Email Validation', () => {
    test('should return true for a valid email address', () => {
        const sut = makeSut()
        const validEmail = faker.internet.email()
        const result = sut.validate(validEmail)
        expect(result).toEqual(true)
    })

    test('should return false for an invalid email address', () => {
        const sut = makeSut()
        const invalidEmail = undefined
        const result = sut.validate(invalidEmail)
        expect(result).toEqual(false)
    })
})
