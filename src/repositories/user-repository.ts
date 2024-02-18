import { UserRequest } from '@/models/dtos/user-request'
import { User, UserModel } from '@/models/user-model'

export interface UserRepositoryInterface {
    save(user: UserRequest): Promise<User>
    getUserByEmail(email: string): Promise<User>
    getUserById(id: string): Promise<User>
}

export class UserRepository implements UserRepositoryInterface {
    async save(user: UserRequest): Promise<User> {
        return await UserModel.create(user)
    }

    async getUserByEmail(email: string): Promise<User> {
        return await UserModel.findOne({ email: email })
    }

    async getUserById(id: string): Promise<User> {
        return await UserModel.findOne({ _id: id })
    }
}
