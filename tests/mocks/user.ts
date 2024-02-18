import { UserRequest } from '@/models/dtos/user-request'
import { UserRepositoryInterface } from '@/repositories/user-repository'
import { faker } from '@faker-js/faker'

export const userRequest: UserRequest = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
    type: 'user'
}

export const invalidUserRequest: any = {
    names: faker.person.fullName(),
    emails: faker.internet.email(),
    passwords: faker.internet.password(),
    phone: faker.phone.number(),
    type: 'user'
}

export class UserRepositorySpy implements UserRepositoryInterface {
    async save(data: UserRequest): Promise<any | undefined> {
        return { _id: faker.string.uuid(), ...userRequest }
    }

    async getUserByEmail(email: string): Promise<any | undefined> {
        return { _id: faker.string.uuid(), ...userRequest }
    }

    async getUserById(id: string): Promise<any | undefined> {
        return { _id: faker.string.uuid(), ...userRequest }
    }
}
