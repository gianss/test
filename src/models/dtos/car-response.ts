import { LastBidInterface } from '../interfaces/lastBid'
import { PhotoInterface } from '../interfaces/photo'
import { UserInterface } from '../interfaces/user'

export interface CarResponse {
    id: string
    brand: string
    carModel: string
    year: number
    location: string
    status: string
    mileage: number
    color: string
    fuelType: string
    transmissionType: string
    registration_date: number
    initialBid: number
    lastBid?: LastBidInterface
    winner?: UserInterface
    photos?: PhotoInterface
}
