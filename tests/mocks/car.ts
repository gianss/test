import { faker } from '@faker-js/faker'
import { CarRequest } from '@/models/dtos/car-request'
import { CarRepositoryInterface } from '@/repositories/car-repository'
import { CarResponse } from '@/models/dtos/car-response'

export const carRequest: CarRequest = {
    brand: faker.vehicle.manufacturer(),
    carModel: faker.vehicle.model(),
    year: faker.date.past().getFullYear(),
    mileage: faker.number.int(),
    color: faker.color.human(),
    fuelType: faker.vehicle.fuel(),
    transmissionType: faker.vehicle.type(),
    status: 'disponivel',
    location: faker.location.city(),
    initialBid: faker.number.int({ min: 1000, max: 10000 })
}

export const invalidCarRequest: any = {
    brands: faker.vehicle.manufacturer(),
    carModels: faker.vehicle.model(),
    years: faker.date.past().getFullYear(),
    mileages: faker.number.int(),
    colors: faker.color.human(),
    fuelType: faker.vehicle.fuel(),
    transmissionType: faker.vehicle.type(),
    status: 'disponivel',
    location: faker.location.city(),
    initialBid: faker.number.int({ min: 1000, max: 10000 })
}

export const carResponse: CarResponse = {
    id: faker.string.uuid(),
    brand: faker.vehicle.manufacturer(),
    carModel: faker.vehicle.model(),
    year: faker.date.past().getFullYear(),
    mileage: faker.number.int(),
    registration_date: faker.number.int(),
    color: faker.color.human(),
    fuelType: faker.vehicle.fuel(),
    transmissionType: faker.vehicle.type(),
    status: 'disponivel',
    location: faker.location.city(),
    initialBid: faker.number.int({ min: 1000, max: 10000 }),
    winner: {
        name: faker.person.fullName(),
        email: faker.internet.email()
    },
    lastBid: {
        value: faker.number.int()
    }
}

export class CarRepositorySpy implements CarRepositoryInterface {
    async save(data: CarRequest): Promise<any | undefined> {
        return { _id: faker.string.uuid(), ...carRequest }
    }

    async list(search: string, limit: number, offset: number): Promise<any[]> {
        return [{
            ...carResponse
        }]
    }

    async update(car: any, id: string): Promise<any> {
        return { _id: faker.string.uuid(), ...carRequest }
    }

    async countTotal(search): Promise<number> {
        return 1
    }

    async getCarById(id: string): Promise<any> {
        return { _id: faker.string.uuid(), ...carRequest }
    }
}
