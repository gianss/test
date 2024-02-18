import { HttpResponse } from '@/models/interfaces/http-response'
import { UserRepositoryInterface } from '@/repositories/user-repository'
import { unauthorized } from '@/utils/http-helper'
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
                return unauthorized()
            }
            if (!roles.includes(user.type)) {
                return unauthorized()
            }
            return {
                statusCode: 200,
                body: { user }
            }
        } catch (error) {
            return unauthorized()
        }
    }
}
