import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { CarRepositoryInterface } from '@/repositories/car-repository'
import { ValidationFieldsSpy } from '@/tests/mocks/validation'
import { CarRepositorySpy } from '@/tests/mocks/car'
import { AddAuctionBidController } from '@/controllers/auction-bind/add-controller'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'
import { AuctionBidRepositorySpy, auctionBidRequest } from '@/tests/mocks/auction-bid'

interface SutTypes {
    sut: AddAuctionBidController
    auctionBidRepositorySpy: AuctionBidRepositoryInterface
    carRepositorySpy: CarRepositoryInterface
    validationFieldsSpy: ValidationFieldsInterface
}

const makeSut = (): SutTypes => {
    const auctionBidRepositorySpy = new AuctionBidRepositorySpy()
    const carRepositorySpy = new CarRepositorySpy()
    const validationFieldsSpy = new ValidationFieldsSpy()
    return {
        sut: new AddAuctionBidController(auctionBidRepositorySpy, carRepositorySpy, validationFieldsSpy),
        auctionBidRepositorySpy,
        carRepositorySpy,
        validationFieldsSpy
    }
}

describe('AddAuctionBidController', () => {
    test('should return status 200 if AuctionBid creation is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({ ...auctionBidRequest, value: 50000 })
        expect(response.statusCode).toEqual(200)
    })

    test('should return a AuctionBid if AuctionBid creation is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({ ...auctionBidRequest, value: 50000 })
        expect(response.body.data).toBeDefined()
        expect(typeof response.body.data).not.toEqual('array')
    })

    test('should return status 400 if validateMissingField fails', async () => {
        const { sut, validationFieldsSpy } = makeSut()
        jest.spyOn(validationFieldsSpy, 'validateMissingField').mockReturnValue('any string')
        const response = await sut.handle(auctionBidRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if validateObjectId fails', async () => {
        const { sut, validationFieldsSpy } = makeSut()
        jest.spyOn(validationFieldsSpy, 'validateObjectId').mockReturnValue('any string')
        const response = await sut.handle(auctionBidRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if car not found', async () => {
        const { sut, carRepositorySpy } = makeSut()
        jest.spyOn(carRepositorySpy, 'getCarById').mockReturnValue(null)

        const response = await sut.handle({ ...auctionBidRequest, value: 50000 })
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if initialBid is greater than value', async () => {
        const { sut, auctionBidRepositorySpy, carRepositorySpy } = makeSut()
        jest.spyOn(auctionBidRepositorySpy, 'getLastBid').mockReturnValue(null)
        jest.spyOn(carRepositorySpy, 'getCarById').mockImplementation(async (id: string) => {
            const carPartial: any = { _id: id, initialBid: 60000 }
            return carPartial
        })
        const response = await sut.handle({ ...auctionBidRequest, value: 50000 })
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if last bid is greater than value', async () => {
        const { sut, auctionBidRepositorySpy } = makeSut()
        jest.spyOn(auctionBidRepositorySpy, 'getLastBid').mockImplementation(async (id: string) => {
            const carPartial: any = { _id: id, value: 60000 }
            return carPartial
        })
        const response = await sut.handle({ ...auctionBidRequest, value: 50000 })
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 400 if validateNumberType fails', async () => {
        const { sut, validationFieldsSpy } = makeSut()
        jest.spyOn(validationFieldsSpy, 'validateNumberType').mockReturnValue('any string')
        const response = await sut.handle(auctionBidRequest)
        expect(response.statusCode).toEqual(400)
    })

    test('should return status 500 if AuctionBid repository throws an error', async () => {
        const { sut, auctionBidRepositorySpy } = makeSut()
        jest.spyOn(auctionBidRepositorySpy, 'save').mockRejectedValueOnce(new Error())
        const response = await sut.handle({ ...auctionBidRequest, value: 50000 })
        expect(response.statusCode).toEqual(500)
    })
})
