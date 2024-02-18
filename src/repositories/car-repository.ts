import { Car, CarModel } from '@/models/car-model'
import { CarRequest } from '@/models/dtos/car-request'

export interface CarRepositoryInterface {
    save(car: CarRequest): Promise<Car>
    update(car: any, id: string): Promise<Car>
    list(search: string | undefined, limit: number | undefined, offset: number | undefined): Promise<Car[]>
    countTotal(search: string): Promise<number>
    getCarById(id: string): Promise<Car>
}

export class CarRepository implements CarRepositoryInterface {
    async save(car: CarRequest): Promise<Car> {
        return await CarModel.create(car)
    }

    async update(car: any, id: string): Promise<Car> {
        await CarModel.updateOne({ _id: id }, car)
        return await CarModel.findOne({ _id: id })
    }

    async list(search: string, limit: number, offset: number): Promise<Car[]> {
        let query = {}
        if (search) {
            query = {
                $or: [
                    { brand: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { carModel: { $regex: search, $options: 'i' } }
                ]
            }
        }

        return await CarModel.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userId: { $toObjectId: '$winner_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$userId'] }
                            }
                        }
                    ],
                    as: 'winner'
                }
            },
            {
                $addFields: {
                    winner: { $arrayElemAt: ['$winner', 0] }
                }
            },
            {
                $lookup: {
                    from: 'auctionbids',
                    let: { carId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$$carId', { $toObjectId: '$car_id' }] }
                            }
                        },
                        {
                            $sort: { value: -1 }
                        },
                        {
                            $limit: 1
                        }
                    ],
                    as: 'lastBid'
                }
            },
            {
                $addFields: {
                    lastBid: { $arrayElemAt: ['$lastBid', 0] }
                }
            },
            {
                $skip: offset | 0
            },
            {
                $limit: limit | 10
            }
        ])
    }

    async countTotal(search: string): Promise<number> {
        let query = {}
        if (search) {
            query = {
                $or: [
                    { brand: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { carModel: { $regex: search, $options: 'i' } }
                ]
            }
        }
        return await CarModel.countDocuments(query, { count: 'total' })
    }

    async getCarById(id: string): Promise<Car> {
        return await CarModel.findOne({ _id: id })
    }
}
