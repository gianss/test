import { model, Document, Schema } from 'mongoose'
import { PhotoInterface } from './interfaces/photo'
import { UserInterface } from './interfaces/user'
import { LastBidInterface } from './interfaces/lastBid'

export interface Car extends Document {
    brand: string
    carModel: string
    year: number
    mileage: number
    color: string
    fuelType: string
    transmissionType: string
    status: string
    location: string
    initialBid: number
    registration_date: number
    photos: PhotoInterface
    winner_id: string
    winner?: UserInterface
    lastBid?: LastBidInterface
}

export enum StatusCar {
    'disponivel' = 'disponivel',
    'vendido' = 'vendido',
    'Finalizado sem arremates' = 'Finalizado sem arremates'
}

const schema = new Schema<Car>({
    brand: { type: String, required: true },
    carModel: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    color: { type: String, required: true },
    fuelType: { type: String, required: true },
    status: { type: String, enum: Object.values(StatusCar), required: true },
    location: { type: String, required: true },
    transmissionType: { type: String, required: true },
    initialBid: { type: Number, required: true },
    winner_id: { type: String },
    photos: { type: Object },
    registration_date: { type: Number, default: Date.now }
})

export const CarModel = model<Car>('Car', schema)
