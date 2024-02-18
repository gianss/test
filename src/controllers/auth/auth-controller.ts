import { HttpResponse } from '@/models/interfaces/http-response'
import { UserRepositoryInterface } from '@/repositories/user-repository'
import { JwtAdapterInterface } from '@/utils/jwt-adapter'

export class AuthController {
    constructor(
        private readonly jwtHashVerify: JwtAdapterInterface,
        private readonly userRepository: UserRepositoryInterface
    ) { }

    async authorize(token: string, roles: string[]): Promise<HttpResponse> {
        try {
            const decodedToken = this.jwtHashVerify.decodeToken(token)
            const user = await this.userRepository.getUserById(decodedToken.id)
            if (!user) {
                return {
                    statusCode: 401,
                    body: { message: 'Token invalido ou expirado. Faça login para gerar um novo token' }
                }
            }
            if (!roles.includes(user.type)) {
                return {
                    statusCode: 401,
                    body: { message: 'Token invalido ou expirado. Faça login para gerar um novo token' }
                }
            }
            return {
                statusCode: 200,
                body: { user }
            }
        } catch (error) {
            // console.log(error)
            return {
                statusCode: 401,
                body: { message: 'Token invalido ou expirado. Faça login para gerar um novo token' }
            }
        }
    }
}
