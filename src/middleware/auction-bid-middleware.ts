import { Request, Response } from 'express'
import { addAuctionBidControllerFactory, listAuctionBidControllerFactory } from './factories/auction-bid-factory'
import { AuctionBidRequest } from '@/models/dtos/auction-bind-request'

export class AuctionBidMiddleware {
    save = async (req: Request, res: Response): Promise<void> => {
        const carController = addAuctionBidControllerFactory()
        const request: AuctionBidRequest = { ...req.body, user_id: req.user._id }
        const response = await carController.handle(request)
        res.status(response.statusCode).json(response.body)
    }

    list = async (req: Request, res: Response): Promise<void> => {
        const carController = listAuctionBidControllerFactory()
        const request = { ...req.query, id: req.params.id }
        const response = await carController.handle(request)
        res.status(response.statusCode).json(response.body)
    }
}
