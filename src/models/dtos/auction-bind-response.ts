import { UserInterface } from '../interfaces/user'

export interface AuctionBidResponse {
    id: string
    car_id: string
    value: number
    date: number
    user?: UserInterface
}
