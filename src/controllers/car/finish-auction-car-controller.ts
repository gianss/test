import { badRequest, ok, serverError } from '@/utils/http-helper'
import { HttpResponse } from '@/models/interfaces/http-response'
import { CarRepositoryInterface } from '@/repositories/car-repository'
import { AuctionBidRepositoryInterface } from '@/repositories/auction-bid-repository'
import { ValidationFieldsInterface } from '@/utils/validation-fields'

export class FinishAuctionCarController {
    constructor(
        private readonly carRepository: CarRepositoryInterface,
        private readonly auctionBidRepository: AuctionBidRepositoryInterface,
        private readonly validationFields: ValidationFieldsInterface
    ) { }

    async handle(id: string): Promise<HttpResponse> {
        try {
            const idValid = this.validationFields.validateObjectId(['id'], { id })
            if (idValid) {
                return badRequest({ message: idValid })
            }
            const car = await this.carRepository.getCarById(id)
            if (!car) {
                return badRequest({ message: 'Veiculo não encontrado' })
            }
            if (car.status !== 'disponivel') {
                return badRequest({ message: 'Este leilão já foi finalizado' })
            }
            const lastBid = await this.auctionBidRepository.getLastBid(id)
            const carUpdating = await this.carRepository.update({ winner_id: lastBid?.user_id, status: lastBid ? 'vendido' : 'Finalizado sem arremates' }, id)
            const vencedor = {
                id,
                registration_date: carUpdating.registration_date,
                bid_date: lastBid?.date,
                user: {
                    name: lastBid?.user?.name || 'Sem vencedor',
                    email: lastBid?.user?.email || ''
                }
            }
            return ok({ data: vencedor })
        } catch (error) {
            // console.log(error)
            return serverError()
        }
    }
}
