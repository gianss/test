import { connectToMongoDB } from '@/config/db'
import { connection } from 'mongoose'

describe('connectToMongoDB function', () => {
    it('should connect to MongoDB successfully', async () => {
        try {
            await connectToMongoDB()
            expect(true).toBe(true)
            await connection.close()
        } catch (error) {
            fail(error)
        }
    })
})
