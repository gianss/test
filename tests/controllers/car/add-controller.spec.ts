import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { AddCarController } from '@/controllers/car/add-controller'
import { CarRepositoryInterface } from '@/repositories/car-repository'
import { ValidationFieldsSpy } from '@/tests/mocks/validation'
import { CarRepositorySpy, carRequest } from '@/tests/mocks/car'

interface SutTypes {
    sut: AddCarController
    carRepositorySpy: CarRepositoryInterface
    validationFieldsSpy: ValidationFieldsInterface
}

const makeSut = (): SutTypes => {
    const carRepositorySpy = new CarRepositorySpy()
    const validationFieldsSpy = new ValidationFieldsSpy()
    return {
        sut: new AddCarController(carRepositorySpy, validationFieldsSpy),
        carRepositorySpy,
        validationFieldsSpy
    }
}

describe('AddCarController', () => {
    test('should return status 200 if car creation is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(carRequest)
        expect(response.statusCode).toEqual(200)
    })

    test('should return a car if car creation is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(carRequest)
        expect(response.body.data).toBeDefined()
        expect(typeof response.body.data).not.toEqual('array')
    })

    test('should return status 400 if validateMissingField fails', async () => {
        const { sut, validationFieldsSpy } = makeSut()
        jest.spyOn(validationFieldsSpy, 'validateMissingField').mockReturnValue('any string')
        const response = await sut.handle(carRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 500 if car repository throws an error', async () => {
        const { sut, carRepositorySpy } = makeSut()
        jest.spyOn(carRepositorySpy, 'save').mockRejectedValueOnce(new Error())
        const response = await sut.handle(carRequest)
        expect(response.statusCode).toEqual(500)
    })
})
