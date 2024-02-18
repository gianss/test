import { PhotoInterface } from '../interfaces/photo'

export interface CarRequest {
    brand: string
    carModel: string
    year: number
    location: string
    status: string
    mileage: number
    color: string
    fuelType: string
    photos?: PhotoInterface
    transmissionType: string
    initialBid: number
}
