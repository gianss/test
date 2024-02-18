import { PhotosInterface } from '../interfaces/photo'

export interface CarRequest {
    brand: string
    carModel: string
    year: number
    location: string
    status: string
    mileage: number
    color: string
    fuelType: string
    photos: PhotosInterface
    transmissionType: string
    initialBid: number
}
