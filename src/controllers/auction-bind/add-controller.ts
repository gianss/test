import { badRequest, ok, serverError } from '@/utils/http-helper'
import { HttpResponse } from '@/models/http-response'
import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { AuctionBidRequest } from '@/models/dtos/auction-bind-request'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'
import { CarRepositoryInterface } from '@/repositories/car-repository'
import { AuctionBidResponse } from '@/models/dtos/auction-bind-response'

export class AddAuctionBidController {
    constructor(
        private readonly AuctionBidRepository: AuctionBidRepositoryInterface,
        private readonly carRepository: CarRepositoryInterface,
        private readonly validationFields: ValidationFieldsInterface
    ) { }

    async handle(request: AuctionBidRequest): Promise<HttpResponse> {
        try {
            const missingFields = this.validationFields.validateMissingField(['value', 'user_id', 'car_id'], request)
            if (missingFields) {
                return badRequest({ message: missingFields })
            }

            const idValid = this.validationFields.validateObjectId(['user_id', 'car_id'], request)
            if (idValid) {
                return badRequest({ message: idValid })
            }

            const invalidNumberFields = this.validationFields.validateNumberType(['value'], request)
            if (invalidNumberFields) {
                return badRequest({ message: invalidNumberFields })
            }

            const { value, user_id, car_id } = request

            const car = await this.carRepository.getCarById(car_id)
            if (!car) {
                return badRequest({ message: 'Desculpe. veiculo não encontrado' })
            }
            if (car.status !== 'disponivel') {
                return badRequest({ message: 'Desculpe. O leilão já foi finalizado' })
            }
            const lastBid = await this.AuctionBidRepository.getLastBid(car_id)
            if (!lastBid && car.initialBid >= value) {
                return badRequest({ message: 'Desculpe. O lance oferecido é menor que o lance minimo' })
            }

            if (lastBid && lastBid.value >= value) {
                return badRequest({ message: 'Desculpe. O lance oferecido é menor que o lance atual' })
            }

            const savedAuctionBid = await this.AuctionBidRepository.save({ value, user_id, car_id })
            const response: AuctionBidResponse = {
                id: savedAuctionBid._id,
                value: savedAuctionBid.value,
                date: savedAuctionBid.date,
                car_id: savedAuctionBid.car_id
            }
            return ok({ data: response })
        } catch (error) {
            // console.log(error)
            return serverError()
        }
    }
}
