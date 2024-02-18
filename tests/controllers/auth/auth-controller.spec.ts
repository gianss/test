import { JwtAdapterSpy } from '@/tests/mocks/jwt'
import { AuthController } from '@/controllers/auth/auth-controller'
import { JwtAdapterInterface } from '@/utils/jwt-adapter'
import { UserRepositorySpy } from '@/tests/mocks/user'

interface SutTypes {
    sut: AuthController
    jwtAdapterSpy: JwtAdapterInterface
    userRepositorySpy: UserRepositorySpy
}

const makeSut = (): SutTypes => {
    const jwtAdapterSpy = new JwtAdapterSpy()
    const userRepositorySpy = new UserRepositorySpy()
    return {
        sut: new AuthController(jwtAdapterSpy, userRepositorySpy),
        jwtAdapterSpy,
        userRepositorySpy
    }
}

describe('AuthController Authorization', () => {
    test('should return true if user has permission', async () => {
        const { sut } = makeSut()
        const hasPermission = await sut.authorize('any_token', ['user'])
        expect(hasPermission.statusCode).toEqual(200)
    })

    test('should return false if user is not found', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'getUserById').mockResolvedValueOnce(undefined)
        const hasPermission = await sut.authorize('any_token', ['user'])
        expect(hasPermission.statusCode).toEqual(401)
    })

    test('should return false if permissions are not granted', async () => {
        const { sut } = makeSut()
        const hasPermission = await sut.authorize('any_token', ['root'])
        expect(hasPermission.statusCode).toEqual(401)
    })

    test('should return false if error', async () => {
        const { sut, userRepositorySpy } = makeSut()
        jest.spyOn(userRepositorySpy, 'getUserById').mockRejectedValue(new Error())
        const hasPermission = await sut.authorize('any_token', ['user'])
        expect(hasPermission.statusCode).toEqual(401)
    })
})
