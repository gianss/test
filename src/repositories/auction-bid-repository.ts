import { AuctionBid, AuctionBidModel } from '@/models/auction-bind-model'
import { AuctionBidRequest } from '@/models/dtos/auction-bind-request'
import { FilterQuery } from 'mongoose'

export interface AuctionBidRepositoryInterface {
    save(auctionBid: AuctionBidRequest): Promise<AuctionBid>
    getLastBid(id: string): Promise<AuctionBid>
    list(id: string): Promise<AuctionBid[]>
    countTotal(id: string): Promise<number>
}

export class AuctionBidRepository implements AuctionBidRepositoryInterface {
    async save(auctionBid: AuctionBidRequest): Promise<AuctionBid> {
        return await AuctionBidModel.create(auctionBid)
    }

    async getLastBid(id: string): Promise<AuctionBid | null> {
        const lastBid = await AuctionBidModel.aggregate([
            {
                $match: { car_id: id }
            },
            {
                $sort: { value: -1 }
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userId: { $toObjectId: '$user_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$userId'] }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                email: 1
                            }
                        }
                    ],
                    as: 'user'
                }
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ['$user', 0] }
                }
            }
        ])

        return lastBid.length > 0 ? lastBid[0] : null
    }

    async list(id: string): Promise<AuctionBid[]> {
        const query: any = {
            car_id: id
        }
        return await AuctionBidModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userId: { $toObjectId: '$user_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$userId'] }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                email: 1
                            }
                        }
                    ],
                    as: 'user'
                }
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ['$user', 0] }
                }
            }
        ])
    }

    async countTotal(id: string): Promise<number> {
        const query: FilterQuery<AuctionBid> = {
            car_id: id
        }
        return await AuctionBidModel.countDocuments(query, { count: 'total' })
    }
}
