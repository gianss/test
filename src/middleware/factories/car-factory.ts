import { AddCarController } from '@/controllers/car/add-controller'
import { FinishAuctionCarController } from '@/controllers/car/finish-auction-car-controller'
import { ListCarController } from '@/controllers/car/list-controller'
import { AuctionBidRepository } from '@/repositories/auction-bid-repository'
import { CarRepository } from '@/repositories/car-repository'
import { ValidationFields } from '@/utils/validation-fields'

export const addCarControllerFactory = (): AddCarController => {
    const carRepository = new CarRepository()
    const validationFields = new ValidationFields()
    return new AddCarController(carRepository, validationFields)
}

export const listCarControllerFactory = (): ListCarController => {
    const carRepository = new CarRepository()
    const auctionBidRepository = new AuctionBidRepository()
    return new ListCarController(carRepository, auctionBidRepository)
}

export const finishAuctionCarControllerFactory = (): FinishAuctionCarController => {
    const carRepository = new CarRepository()
    const auctionBidRepository = new AuctionBidRepository()
    const validationFields = new ValidationFields()
    return new FinishAuctionCarController(carRepository, auctionBidRepository, validationFields)
}
