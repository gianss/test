import { AddUserController } from '@/controllers/user/add-controller'
import { BcryptAdapterInterface } from '@/utils/bcrypt-adapter'
import { UserRepositoryInterface } from '@/repositories/user-repository'
import { EmailValidationInterface } from '@/utils/email-validator'
import { JwtAdapterInterface } from '@/utils/jwt-adapter'
import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { UserRepositorySpy, userRequest } from '@/tests/mocks/user'
import { EmailValidationSpy, ValidationFieldsSpy } from '@/tests/mocks/validation'
import { BcryptAdapterSpy } from '@/tests/mocks/bcrypt'
import { JwtAdapterSpy } from '@/tests/mocks/jwt'

interface SutTypes {
    sut: AddUserController
    userRepositorySpy: UserRepositoryInterface
    bcryptAdapterSpy: BcryptAdapterInterface
    emailValidationSpy: EmailValidationInterface
    jwtAdapterSpy: JwtAdapterInterface
    validationFieldsSpy: ValidationFieldsInterface
}

const makeSut = (): SutTypes => {
    const userRepositorySpy = new UserRepositorySpy()
    const emailValidationSpy = new EmailValidationSpy()
    const jwtAdapterSpy = new JwtAdapterSpy()
    const validationFieldsSpy = new ValidationFieldsSpy()
    const bcryptAdapterSpy = new BcryptAdapterSpy()
    return {
        sut: new AddUserController(userRepositorySpy, emailValidationSpy, validationFieldsSpy, bcryptAdapterSpy, jwtAdapterSpy),
        userRepositorySpy,
        bcryptAdapterSpy,
        emailValidationSpy,
        jwtAdapterSpy,
        validationFieldsSpy
    }
}

describe('AddUserController', () => {
    test('should return status 200 if createUser is successful', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'getUserByEmail').mockReturnValue(null)
        const response = await sut.handle(userRequest)
        expect(response.statusCode).toEqual(200)
    })

    test('should return a token if createUser is successful', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'getUserByEmail').mockReturnValue(null)
        const response = await sut.handle(userRequest)
        expect(response.body.token).toBeDefined()
        expect(response.body.token).not.toEqual('')
    })

    test('should return status 400 if validateMissingField fails', async () => {
        const { sut, validationFieldsSpy } = makeSut()
        jest.spyOn(validationFieldsSpy, 'validateMissingField').mockReturnValue('any string')
        const response = await sut.handle(userRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if email is used', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(userRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if email is invalid', async () => {
        const { sut, emailValidationSpy } = makeSut()
        jest.spyOn(emailValidationSpy, 'validate').mockReturnValue(false)
        const response = await sut.handle(userRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 500 if userRepository throws', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'getUserByEmail').mockReturnValue(null)
        jest.spyOn(userRepositorySpy, 'save').mockRejectedValueOnce(new Error())
        const response = await sut.handle(userRequest)
        expect(response.statusCode).toEqual(500)
    })
})
