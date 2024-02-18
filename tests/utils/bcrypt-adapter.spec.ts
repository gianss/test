import { BcryptAdapter } from '@/utils/bcrypt-adapter'
import { faker } from '@faker-js/faker'

describe('BcryptAdapter', () => {
    const salt = 10
    const sut = new BcryptAdapter(salt)

    describe('generatePassword', () => {
        test('should generate a hash password', async () => {
            const password = faker.lorem.word()
            const hashedPassword = await sut.generatePassword(password)
            expect(typeof hashedPassword).toBe('string')
            expect(hashedPassword).not.toBe(password)
        })
    })

    describe('comparePassword', () => {
        test('should return true for matching password and hash', async () => {
            const password = faker.lorem.word()
            const hashedPassword = await sut.generatePassword(password)
            const result = await sut.comparePassword(password, hashedPassword)
            expect(result).toBe(true)
        })

        test('should return false for non-matching password and hash', async () => {
            const password = faker.lorem.word()
            const hashedPassword = await sut.generatePassword(password)
            const result = await sut.comparePassword('wrongPassword', hashedPassword)
            expect(result).toBe(false)
        })
    })
})
