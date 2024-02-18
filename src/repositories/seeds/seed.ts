import { UserModel } from '../../models/user-model'
import mongoose from 'mongoose'
import { BcryptAdapter } from '../../utils/bcrypt-adapter'
import { config } from 'dotenv'

async function connectToMongoDB(): Promise<any> {
    return await new Promise((resolve, reject) => {
        config()
        mongoose.connect(process.env.MONGODB_CONNECTION_URL || '')
        mongoose.connection.once('open', resolve)
        mongoose.connection.on('error', reject)
    })
}

async function runMigration(): Promise<void> {
    try {
        await connectToMongoDB()
        const existingUser = await UserModel.findOne({ email: 'admin@instacarro.com' })
        if (!existingUser) {
            const bcryptAdapter = new BcryptAdapter(5)
            await UserModel.create({
                name: 'instacarro',
                email: 'admin@instacarro.com',
                password: await bcryptAdapter.generatePassword('123456'),
                type: 'root',
                phone: '77988855954'
            })
            console.log('Novo usuário criado.')
        } else {
            console.log('Usuário já existe. Nenhuma migração necessária.')
        }
        console.log('Migração concluída.')
    } catch (error) {
        console.error('Erro ao executar a migração:', error)
    } finally {
        mongoose.disconnect()
    }
}

runMigration()
