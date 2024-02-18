import { LastBingInterface } from '../interfaces/lastBid'
import { PhotosInterface } from '../interfaces/photo'
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
    lastBid?: LastBingInterface
    winner?: UserInterface
    photos: PhotosInterface
}
