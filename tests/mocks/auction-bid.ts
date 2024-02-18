import { faker } from '@faker-js/faker'
import { AuctionBidRequest } from '@/models/dtos/auction-bind-request'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'

export const auctionBidRequest: AuctionBidRequest = {
    value: 40000,
    car_id: faker.string.uuid(),
    user_id: faker.string.uuid()
}

export const invalidAuctionBidRequest: any = {
    values: 40000,
    car_ids: faker.string.uuid(),
    user_ids: faker.string.uuid()
}

export class AuctionBidRepositorySpy implements AuctionBidRepositoryInterface {
    async save(data: AuctionBidRequest): Promise<any | undefined> {
        return { _id: faker.string.uuid(), ...auctionBidRequest }
    }

    async list(id: string): Promise<any[]> {
        return [{
            ...auctionBidRequest
        }]
    }

    async countTotal(id: string): Promise<number> {
        return 1
    }

    async getLastBid(id: string): Promise<any> {
        return { _id: faker.string.uuid(), ...auctionBidRequest }
    }
}
