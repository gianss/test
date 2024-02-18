import { model, Document, Schema } from 'mongoose'
import { User } from './user-model'

export interface AuctionBid extends Document {
    value: number
    user_id: string
    car_id: string
    date: number
    user?: User
}

const schema = new Schema<AuctionBid>({
    value: { type: Number, required: true },
    user_id: { type: String, required: true },
    car_id: { type: String, required: true },
    date: { type: Number, default: Date.now }
})

export const AuctionBidModel = model<AuctionBid>('AuctionBid', schema)
