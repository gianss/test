import request from 'supertest'
import { connectToMongoDB } from '@/config/db'
import { app } from '@/app'
import { connection } from 'mongoose'
import { invalidUserRequest, userRequest } from '../mocks/user'

let server

beforeAll(async () => {
    await connectToMongoDB()
    server = app.listen(5000, (): void => {
        console.log(`Test running on port ${5000}`)
    })
})

afterAll(async () => {
    await server.close()
    await connection.close()
})

describe('Add User Integration Tests', () => {
    test('should return a successful response when creating a user with valid data', async () => {
        const response = await request(server)
            .post('/user')
            .send({ ...userRequest, email: 'any_email@gmail.com' })
        expect(response.status).toBe(200)
    })

    test('should return status 400 when creating a user with invalid data', async () => {
        const response = await request(server)
            .post('/user')
            .send(invalidUserRequest)
        expect(response.status).toBe(400)
    })

    test('should return status 400 when creating a user with an invalid email format', async () => {
        const response = await request(server)
            .post('/user')
            .send({ ...userRequest, email: 'invalidemail.com' })
        expect(response.status).toBe(400)
    })

    test('should return status 400 when attempting to create a user with an email that is already in use', async () => {
        const response = await request(server)
            .post('/user')
            .send({ ...userRequest, email: 'any_email@gmail.com' })
        expect(response.status).toBe(400)
    })
})
