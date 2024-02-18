import { AddAuctionBidController } from '@/controllers/auction-bind/add-controller'
import { ListAuctionBidController } from '@/controllers/auction-bind/list-controller'
import { AuctionBidRepository } from '@/repositories/auction-bid-repository'
import { CarRepository } from '@/repositories/car-repository'
import { ValidationFields } from '@/utils/validation-fields'

export const addAuctionBidControllerFactory = (): AddAuctionBidController => {
    const auctionBidRepository = new AuctionBidRepository()
    const carRepository = new CarRepository()
    const validationFields = new ValidationFields()
    return new AddAuctionBidController(auctionBidRepository, carRepository, validationFields)
}

export const listAuctionBidControllerFactory = (): ListAuctionBidController => {
    const auctionBidRepository = new AuctionBidRepository()
    const validationFields = new ValidationFields()
    return new ListAuctionBidController(auctionBidRepository, validationFields)
}
