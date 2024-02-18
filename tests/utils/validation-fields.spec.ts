import { faker } from '@faker-js/faker'
import { ValidationFields } from '@/utils/validation-fields'

const makeSut = (): ValidationFields => {
    return new ValidationFields()
}

function getRandomArbitrary(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

describe('ValidationFields (validateMissingField)', () => {
    test('should return null if all required fields are present', () => {
        const sut = makeSut()
        const loopNumber = getRandomArbitrary(4, 10)
        const request: any = {}
        const requiredFields: string[] = []

        // Act
        for (let loop = 0; loop < loopNumber; loop++) {
            const input = faker.lorem.word()
            request[input] = faker.lorem.word()
            requiredFields.push(input)
        }
        const result = sut.validateMissingField(requiredFields, request)
        expect(result).toEqual(null)
    })

    test('should return a message if any required field is missing', () => {
        const sut = makeSut()
        const request: any = {}
        const requiredFields = ['any_input']

        // Act
        const result = sut.validateMissingField(requiredFields, request)
        expect(typeof result).toEqual('string')
    })
})

describe('ValidationFields (validateNumberType)', () => {
    test('should return null if all fields are of the correct number type', () => {
        const sut = makeSut()
        const loopNumber = getRandomArbitrary(4, 10)
        const request: any = {}
        const requiredFields: string[] = []
        for (let loop = 0; loop < loopNumber; loop++) {
            const input = faker.lorem.word()
            request[input] = faker.number.int()
            requiredFields.push(input)
        }
        const result = sut.validateNumberType(requiredFields, request)
        expect(result).toEqual(null)
    })

    test('should return a message if any field has an incorrect number type', () => {
        const sut = makeSut()
        const request: any = {
            any_input: 'test'
        }
        const requiredFields = ['any_input']
        const result = sut.validateNumberType(requiredFields, request)
        expect(typeof result).toEqual('string')
    })
})

describe('ValidationFields (validateEnum)', () => {
    test('should return null if the field value is a valid enum value', () => {
        const sut = makeSut()
        const request: any = { status: 'ativo' }
        enum StatusCar {
            'ativo' = 'ativo',
            'vendido' = 'vendido'
        };
        const result = sut.validateEnum(request.status, StatusCar, 'status')
        expect(result).toEqual(null)
    })

    test('should return a message if the field value is not a valid enum value', () => {
        const sut = makeSut()
        const request: any = { status: 'ativado' }
        enum StatusCar {
            'status' = 'status',
            'vendido' = 'vendido'
        };
        const result = sut.validateEnum(request.status, StatusCar, 'status')
        expect(typeof result).toEqual('string')
    })
})
