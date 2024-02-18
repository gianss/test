import request from 'supertest'
import { UserRequest } from '@/models/dtos/user-request'
import { UserModel } from '@/models/user-model'
import { BcryptAdapter } from '@/utils/bcrypt-adapter'
import { faker } from '@faker-js/faker'
import { connectToMongoDB } from '@/config/db'
import { app } from '@/app'
import { connection } from 'mongoose'
import { carRequest } from '../mocks/car'
import { CarModel } from '@/models/car-model'
import { auctionBidRequest, invalidAuctionBidRequest } from '../mocks/auction-bid'
import { AuctionBidModel } from '@/models/auction-bind-model'

const email = faker.internet.email()
let server
let token
let car
let car2
let carSold

beforeAll(async () => {
    await connectToMongoDB()
    const bcryptAdapter = new BcryptAdapter(10)
    const user: UserRequest = {
        email,
        password: await bcryptAdapter.generatePassword('123456'),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        type: 'user'
    }
    const userDb = await UserModel.create(user)
    car = await CarModel.create({ ...carRequest, initialBid: 15000 })
    car2 = await CarModel.create({ ...carRequest, initialBid: 15000 })
    carSold = await CarModel.create({ ...carRequest, status: 'vendido' })
    await AuctionBidModel.create({ value: 25000, car_id: car2._id, user_id: userDb._id })
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

describe('Add auction-bid Integration Tests', () => {
    test('should return 400 if there have been no bids and the bid value is less than the minimum', async () => {
        const response = await request(server)
            .post('/auction-bid')
            .set('x-access-token', token)
            .send({ ...auctionBidRequest, car_id: car._id, value: 10000 })

        expect(response.status).toBe(400)
    })

    test('should return 400 if there have been bids and the value is less than the last bid', async () => {
        const response = await request(server)
            .post('/auction-bid')
            .set('x-access-token', token)
            .send({ ...auctionBidRequest, car_id: car2._id, value: 10000 })

        expect(response.status).toBe(400)
    })

    test('should return a successful response when creating a auction-bid with valid data', async () => {
        const response = await request(server)
            .post('/auction-bid')
            .set('x-access-token', token)
            .send({ ...auctionBidRequest, car_id: car._id })
        expect(response.status).toBe(200)
    })

    test('should return status 400 when creating a auction-bid with invalid data', async () => {
        const response = await request(server)
            .post('/auction-bid')
            .set('x-access-token', token)
            .send({ ...invalidAuctionBidRequest, car_id: car2._id })
        expect(response.status).toBe(400)
    })

    test('should return status 400 if any value is in an invalid format', async () => {
        const response = await request(server)
            .post('/auction-bid')
            .set('x-access-token', token)
            .send({ ...auctionBidRequest, value: 'any_invalid_bid', car_id: car2._id })
        expect(response.status).toBe(400)
    })

    test('should return status 400 if the car has been sold', async () => {
        const response = await request(server)
            .post('/auction-bid')
            .set('x-access-token', token)
            .send({ ...auctionBidRequest, car_id: carSold._id })
        expect(response.status).toBe(400)
    })

    test('should return status 401 if token is invalid', async () => {
        const response = await request(server)
            .post('/auction-bid')
            .set('x-access-token', 'invalid_token')
            .send(invalidAuctionBidRequest)
        expect(response.status).toBe(401)
    })

    test('should return status 401 if token is not provided', async () => {
        const response = await request(server)
            .post('/auction-bid')
            .send(invalidAuctionBidRequest)
        expect(response.status).toBe(401)
    })
})

describe('List auction-bid Integration Tests', () => {
    test('should return a successful response when listing auction-bids successfully', async () => {
        const response = await request(server)
            .get(`/auction-bid/list/${car._id}`)
        expect(response.status).toBe(200)
    })
})
