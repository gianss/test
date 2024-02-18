import { ok, serverError } from '@/utils/http-helper'
import { HttpResponse } from '@/models/interfaces/http-response'
import { CarRepositoryInterface } from '@/repositories/car-repository'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'
import { CarResponse } from '@/models/dtos/car-response'

export class ListCarController {
    constructor(
        private readonly carRepository: CarRepositoryInterface,
        private readonly auctionBidRepository: AuctionBidRepositoryInterface
    ) { }

    async handle(request: any): Promise<HttpResponse> {
        try {
            const { search, limit, offset } = request
            const cars = await this.carRepository.list(search, limit, offset)
            const carsResponse = cars.map((car): CarResponse => {
                return {
                    id: car._id,
                    brand: car.brand,
                    carModel: car.carModel,
                    year: car.year,
                    location: car.location,
                    status: car.status,
                    mileage: car.mileage,
                    color: car.color,
                    fuelType: car.fuelType,
                    registration_date: car.registration_date,
                    transmissionType: car.transmissionType,
                    initialBid: car.initialBid,
                    photos: car.photos,
                    lastBid: {
                        value: car.lastBid?.value
                    },
                    winner: {
                        name: car.winner?.name,
                        email: car.winner?.email
                    }
                }
            })
            const total = await this.carRepository.countTotal(search)
            return ok({ total, data: carsResponse })
        } catch (error) {
            // console.log(error)
            return serverError()
        }
    }
}
