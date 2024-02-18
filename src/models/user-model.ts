import { model, Document, Schema } from 'mongoose'

export interface User extends Document {
    type: string
    name: string
    email: string
    password: string
    phone: string
}

const schema = new Schema<User>({
    type: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true }
})

export const UserModel = model<User>('User', schema)
