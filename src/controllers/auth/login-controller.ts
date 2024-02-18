import { badRequest, ok, serverError, unauthorized } from '@/utils/http-helper'
import { HttpResponse } from '@/models/interfaces/http-response'
import { UserRepositoryInterface } from '@/repositories/user-repository'
import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { EmailValidationInterface } from '@/utils/email-validator'
import { BcryptAdapterInterface } from '@/utils/bcrypt-adapter'
import { JwtAdapterInterface } from '@/utils/jwt-adapter'
import { LoginRequest } from '@/models/dtos/login-request'

export class LoginController {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly emailValidator: EmailValidationInterface,
        private readonly validationFields: ValidationFieldsInterface,
        private readonly bcryptAdapter: BcryptAdapterInterface,
        private readonly jwtAdapter: JwtAdapterInterface
    ) { }

    async handle(request: LoginRequest): Promise<HttpResponse> {
        try {
            const missingFields = this.validationFields.validateMissingField(['email', 'password'], request)
            if (missingFields) {
                return badRequest({ message: missingFields })
            }
            const { email, password } = request
            if (!this.emailValidator.validate(email)) {
                return badRequest({ message: 'O email fornecido é invalido.' })
            }
            const user = await this.userRepository.getUserByEmail(email)
            if (!user) {
                return unauthorized('Usuário ou senha invalidos.')
            }
            const passwordIsValid = await this.bcryptAdapter.comparePassword(password, user.password)
            if (!passwordIsValid) {
                return unauthorized('Usuário ou senha invalidos.')
            }
            const token = this.jwtAdapter.generateToken({ id: user.id })
            return ok({ token })
        } catch (error) {
            // console.log(error)
            return serverError()
        }
    }
}
