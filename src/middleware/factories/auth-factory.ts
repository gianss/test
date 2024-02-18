import { AuthController } from '@/controllers/auth/auth-controller'
import { UserRepository } from '@/repositories/user-repository'
import { JwtAdapter } from '@/utils/jwt-adapter'

export const authFactoryController = (): AuthController => {
    const jwtAdapter = new JwtAdapter()
    const userRepository = new UserRepository()
    return new AuthController(jwtAdapter, userRepository)
}
