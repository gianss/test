import { faker } from '@faker-js/faker'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'
import { AuctionBidRepositorySpy } from '@/tests/mocks/auction-bid'
import { ListAuctionBidController } from '@/controllers/auction-bind/list-controller'
import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { ValidationFieldsSpy } from '@/tests/mocks/validation'

interface SutTypes {
    sut: ListAuctionBidController
    auctionBidRepositorySpy: AuctionBidRepositoryInterface
    validationFieldsSpy: ValidationFieldsInterface
}

const makeSut = (): SutTypes => {
    const auctionBidRepositorySpy = new AuctionBidRepositorySpy()
    const validationFieldsSpy = new ValidationFieldsSpy()
    return {
        sut: new ListAuctionBidController(auctionBidRepositorySpy, validationFieldsSpy),
        auctionBidRepositorySpy,
        validationFieldsSpy
    }
}

describe('ListAuctionBidController', () => {
    test('should return status 200 if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({ id: faker.string.uuid() })
        expect(response.statusCode).toEqual(200)
    })

    test('should return status 400 if id is invalid', async () => {
        const { sut, validationFieldsSpy } = makeSut()
        jest.spyOn(validationFieldsSpy, 'validateObjectId').mockReturnValue('any string')

        const response = await sut.handle({ id: faker.string.uuid() })
        expect(response.statusCode).toEqual(400)
    })

    test('should return a list of auction bids if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({ id: faker.string.uuid() })
        expect(response.body.data).toBeDefined()
        expect(Array.isArray(response.body.data)).toBeTruthy()
    })

    test('should return status 500 if auction bid repository throws an error', async () => {
        const { sut, auctionBidRepositorySpy } = makeSut()
        jest.spyOn(auctionBidRepositorySpy, 'list').mockRejectedValueOnce(new Error())
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(500)
    })
})
