import { CarRepositoryInterface } from '@/repositories/car-repository'
import { ListCarController } from '@/controllers/car/list-controller'
import { CarRepositorySpy } from '@/tests/mocks/car'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'
import { AuctionBidRepositorySpy } from '@/tests/mocks/auction-bid'

interface SutTypes {
    sut: ListCarController
    carRepositorySpy: CarRepositoryInterface
    auctionBidRepositorySpy: AuctionBidRepositoryInterface
}

const makeSut = (): SutTypes => {
    const carRepositorySpy = new CarRepositorySpy()
    const auctionBidRepositorySpy = new AuctionBidRepositorySpy()
    return {
        sut: new ListCarController(carRepositorySpy, auctionBidRepositorySpy),
        carRepositorySpy,
        auctionBidRepositorySpy
    }
}

describe('ListCarController', () => {
    test('should return status 200 if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(200)
    })

    test('should return a list of cars if listing is successful', async () => {
        const { sut } = makeSut()
        const response = await sut.handle({})
        expect(response.body.data).toBeDefined()
        expect(Array.isArray(response.body.data)).toBeTruthy()
    })

    test('should return status 500 if car repository throws an error', async () => {
        const { sut, carRepositorySpy } = makeSut()
        jest.spyOn(carRepositorySpy, 'list').mockRejectedValueOnce(new Error())
        const response = await sut.handle({})
        expect(response.statusCode).toEqual(500)
    })
})
