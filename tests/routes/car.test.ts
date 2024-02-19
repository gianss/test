import request from 'supertest'
import { UserRequest } from '@/models/dtos/user-request'
import { UserModel } from '@/models/user-model'
import { BcryptAdapter } from '@/utils/bcrypt-adapter'
import { faker } from '@faker-js/faker'
import { connectToMongoDB } from '@/config/db'
import { app } from '@/app'
import { connection } from 'mongoose'
import { carRequest, invalidCarRequest } from '../mocks/car'
import { CarModel } from '@/models/car-model'
import { AuctionBidModel } from '@/models/auction-bind-model'

const email = faker.internet.email()
let server
let token
let car
let car2
beforeAll(async () => {
    await connectToMongoDB()
    const bcryptAdapter = new BcryptAdapter(10)
    const user: UserRequest = {
        email,
        password: await bcryptAdapter.generatePassword('123456'),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        type: 'root'
    }
    const userDb = await UserModel.create(user)
    car = await CarModel.create(carRequest)
    car2 = await CarModel.create({ ...carRequest, initialBid: 15000 })
    await AuctionBidModel.create({ value: 25000, car_id: car._id, user_id: userDb._id })
    server = app.listen(5000, (): void => {
        console.log(`Test running on port ${5000}`)
    })

    const loginResponse = await request(server)
        .post('/auth/login')
        .send({ email, password: '123456' })
    token = loginResponse.body.token
})

afterAll(async () => {
    await UserModel.deleteMany()
    await CarModel.deleteMany()
    await AuctionBidModel.deleteMany()
    await server.close()
    await connection.close()
})

describe('Add Car Integration Tests', () => {
    test('should return a successful response when creating a car with valid data and file upload', async () => {
        const requestObject = request(server)
            .post('/car')
            .set('x-access-token', token)
        Object.keys(carRequest).forEach(key => {
            requestObject.field(key, carRequest[key])
        })
        requestObject.attach('photos', './public/logo.png')
        const response = await requestObject
        expect(response.status).toBe(200)
    })

    test('should return status 400 when creating a car with invalid data', async () => {
        const response = await request(server)
            .post('/car')
            .set('x-access-token', token)
            .send(invalidCarRequest)
        expect(response.status).toBe(400)
    })

    test('should return status 400 if any value is in an invalid format', async () => {
        const response = await request(server)
            .post('/car')
            .set('x-access-token', token)
            .send({ ...carRequest, initialBid: 'any_invalid_bid' })
        expect(response.status).toBe(400)
    })

    test('should return status 401 if token is invalid', async () => {
        const response = await request(server)
            .post('/car')
            .set('x-access-token', 'invalid_token')
            .send({ ...carRequest })
        expect(response.status).toBe(401)
    })

    test('should return status 401 if token is not provided', async () => {
        const response = await request(server)
            .post('/car')
            .send({ ...carRequest })
        expect(response.status).toBe(401)
    })
})

describe('List Car Integration Tests', () => {
    test('should return a successful response when listing cars successfully', async () => {
        const response = await request(server)
            .get('/car')
        expect(response.status).toBe(200)
    })

    test('should return a successful response when listing cars successfully with additional parameters', async () => {
        const response = await request(server)
            .get('/car')
            .query({ search: 'any_value', limit: 15, offset: 0 })
        expect(response.status).toBe(200)
    })
})

describe('Finish Auction Car Integration Tests', () => {
    test('should return a successful response when auction is finished correctly', async () => {
        const response = await request(server)
            .put(`/car/finish-auction/${car._id}`)
            .set('x-access-token', token)
        expect(response.status).toBe(200)
    })

    test('should return a successful response when the auction finishes correctly with no bids for the vehicle', async () => {
        const response = await request(server)
            .put(`/car/finish-auction/${car2._id}`)
            .set('x-access-token', token)

        expect(response.status).toBe(200)
    })

    test('should return a 400 error if the auction has already been closed before', async () => {
        const response = await request(server)
            .put(`/car/finish-auction/${car._id}`)
            .set('x-access-token', token)
        expect(response.status).toBe(400)
    })

    test('should return a 400 error if the ID is invalid', async () => {
        const response = await request(server)
            .put('/car/finish-auction/222')
            .set('x-access-token', token)
        expect(response.status).toBe(400)
    })
})
