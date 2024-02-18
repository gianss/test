import { faker } from '@faker-js/faker'
import { LoginController } from '@/controllers/auth/login-controller'
import { UserRepositoryInterface } from '@/repositories/user-repository'
import { UserRepositorySpy } from '@/tests/mocks/user'
import { BcryptAdapterSpy } from '@/tests/mocks/bcrypt'
import { BcryptAdapterInterface } from '@/utils/bcrypt-adapter'
import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { JwtAdapterSpy } from '@/tests/mocks/jwt'
import { JwtAdapterInterface } from '@/utils/jwt-adapter'
import { EmailValidationSpy, ValidationFieldsSpy } from '@/tests/mocks/validation'
import { EmailValidationInterface } from '@/utils/email-validator'

const loginRequest = {
    email: faker.internet.email(),
    password: faker.internet.password()
}

interface SutTypes {
    sut: LoginController
    emailValidationSpy: EmailValidationInterface
    userRepositorySpy: UserRepositoryInterface
    bcryptAdapterSpy: BcryptAdapterInterface
    validationFieldsSpy: ValidationFieldsInterface
    jwtAdapterSpy: JwtAdapterInterface
}

const makeSut = (): SutTypes => {
    const userRepositorySpy = new UserRepositorySpy()
    const bcryptAdapterSpy = new BcryptAdapterSpy()
    const validationFieldsSpy = new ValidationFieldsSpy()
    const jwtAdapterSpy = new JwtAdapterSpy()
    const emailValidationSpy = new EmailValidationSpy()
    return {
        sut: new LoginController(userRepositorySpy, emailValidationSpy, validationFieldsSpy, bcryptAdapterSpy, jwtAdapterSpy),
        emailValidationSpy,
        userRepositorySpy,
        bcryptAdapterSpy,
        validationFieldsSpy,
        jwtAdapterSpy
    }
}

describe('loginController', () => {
    test('should return status 200 if login is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(200)
    })

    test('should return a token if login  is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(loginRequest)
        expect(response.body.token).toBeDefined()
        expect(response.body.token).not.toEqual('')
    })

    test('should return status 400 if emailValidation fail', async () => {
        const { sut, emailValidationSpy } = makeSut()
        jest.spyOn(emailValidationSpy, 'validate').mockReturnValue(false)
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 401 if email is invalid', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'getUserByEmail').mockResolvedValueOnce(undefined)
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(401)
    })

    test('should return status 401 if password is invalid', async () => {
        const { sut, bcryptAdapterSpy } = makeSut()
        jest.spyOn(bcryptAdapterSpy, 'comparePassword').mockResolvedValueOnce(false)
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(401)
    })

    test('should return status 500 if userRepository thrown', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'getUserByEmail').mockRejectedValueOnce(new Error())
        const response = await sut.handle(loginRequest)
        expect(response.statusCode).toEqual(500)
    })
})
