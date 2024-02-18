import request from 'supertest'
import { UserRequest } from '@/models/dtos/user-request'
import { UserModel } from '@/models/user-model'
import { BcryptAdapter } from '@/utils/bcrypt-adapter'
import { faker } from '@faker-js/faker'
import { connectToMongoDB } from '@/config/db'
import { app } from '@/app'
import { connection } from 'mongoose'

const email = faker.internet.email()
let server

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
    await UserModel.create(user)
    server = app.listen(5000, (): void => {
        console.log(`test running on port ${5000}`)
    })
})

afterAll(async () => {
    await UserModel.deleteMany()
    await server.close()
    await connection.close()
})

describe('Auth Integration Test', () => {
    test('should return a successful response when login is valid', async () => {
        const response = await request(server)
            .post('/auth/login')
            .send({
                email,
                password: '123456'
            })
        expect(response.status).toBe(200)
    })

    test('should return status 400 for invalid fields', async () => {
        const response = await request(server)
            .post('/auth/login')
            .send({
                email: 'email_invalido',
                password: ''
            })
        expect(response.status).toBe(400)
    })

    test('should return status 401 for unauthorized login', async () => {
        const response = await request(server)
            .post('/auth/login')
            .send({
                email: 'email_valido@teste.com',
                password: 'senha_valida'
            })
        expect(response.status).toBe(401)
    })
})
