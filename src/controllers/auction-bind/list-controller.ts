import { badRequest, ok, serverError } from '@/utils/http-helper'
import { HttpResponse } from '@/models/interfaces/http-response'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'
import { AuctionBidResponse } from '@/models/dtos/auction-bind-response'
import { ValidationFieldsInterface } from '@/utils/validation-fields'

export class ListAuctionBidController {
    constructor(
        private readonly auctionBidRepository: AuctionBidRepositoryInterface,
        private readonly validationFields: ValidationFieldsInterface
    ) { }

    async handle(request: any): Promise<HttpResponse> {
        try {
            const { id } = request
            const idValid = this.validationFields.validateObjectId(['id'], { id })
            if (idValid) {
                return badRequest({ message: idValid })
            }
            const auctionsBid = await this.auctionBidRepository.list(id)
            const total = await this.auctionBidRepository.countTotal(id)
            const response: AuctionBidResponse[] = auctionsBid.map((bid): AuctionBidResponse => {
                return {
                    id: bid._id,
                    value: bid.value,
                    date: bid.date,
                    car_id: bid.car_id,
                    user: bid.user
                }
            })
            return ok({ total, data: response })
        } catch (error) {
            // console.log(error)
            return serverError()
        }
    }
}
