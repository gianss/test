import { faker } from '@faker-js/faker'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'
import { AuctionBidRepositorySpy } from '@/tests/mocks/auction-bid'
import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { ValidationFieldsSpy } from '@/tests/mocks/validation'
import { FinishAuctionCarController } from '@/controllers/car/finish-auction-car-controller'
import { CarRepositorySpy } from '@/tests/mocks/car'
import { CarRepositoryInterface } from '@/repositories/car-repository'

interface SutTypes {
    sut: FinishAuctionCarController
    carRepositorySpy: CarRepositoryInterface
    auctionBidRepositorySpy: AuctionBidRepositoryInterface
    validationFieldsSpy: ValidationFieldsInterface
}

const makeSut = (): SutTypes => {
    const carRepositorySpy = new CarRepositorySpy()
    const auctionBidRepositorySpy = new AuctionBidRepositorySpy()
    const validationFieldsSpy = new ValidationFieldsSpy()
    return {
        sut: new FinishAuctionCarController(carRepositorySpy, auctionBidRepositorySpy, validationFieldsSpy),
        carRepositorySpy,
        auctionBidRepositorySpy,
        validationFieldsSpy
    }
}

describe('Finish Auction Car Controller', () => {
    test('should return status 200 if finishing auction is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle(faker.string.uuid())
        expect(response.statusCode).toEqual(200)
    })

    test('should return status 400 if car does not exist', async () => {
        const { sut, carRepositorySpy } = makeSut()
        jest.spyOn(carRepositorySpy, 'getCarById').mockReturnValue(null)
        const response = await sut.handle(faker.string.uuid())
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if car status is not available', async () => {
        const { sut, carRepositorySpy } = makeSut()
        jest.spyOn(carRepositorySpy, 'getCarById').mockImplementation(async (id: string) => {
            const carPartial: any = { _id: id, status: 'vendido' }
            return carPartial
        })
        const response = await sut.handle(faker.string.uuid())
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 500 if auction bid repository throws an error', async () => {
        const { sut, auctionBidRepositorySpy } = makeSut()
        jest.spyOn(auctionBidRepositorySpy, 'getLastBid').mockRejectedValueOnce(new Error())
        const response = await sut.handle(faker.string.uuid())
        expect(response.statusCode).toEqual(500)
    })
})
