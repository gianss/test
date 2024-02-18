import { UserRequest } from '@/models/dtos/user-request'
import { badRequest, ok, serverError } from '@/utils/http-helper'
import { HttpResponse } from '@/models/http-response'
import { UserRepositoryInterface } from '@/repositories/user-repository'
import { ValidationFieldsInterface } from '@/utils/validation-fields'
import { EmailValidationInterface } from '@/utils/email-validator'
import { BcryptAdapterInterface } from '@/utils/bcrypt-adapter'
import { JwtAdapterInterface } from '@/utils/jwt-adapter'

export class AddUserController {
    constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly emailValidator: EmailValidationInterface,
        private readonly validationFields: ValidationFieldsInterface,
        private readonly bcryptAdapter: BcryptAdapterInterface,
        private readonly jwtAdapter: JwtAdapterInterface
    ) { }

    async handle(request: UserRequest): Promise<HttpResponse> {
        try {
            const missingFields = this.validationFields.validateMissingField(['name', 'email', 'password', 'phone'], request)
            if (missingFields) {
                return badRequest({ message: missingFields })
            }

            const { name, email, password, phone } = request
            if (!this.emailValidator.validate(email)) {
                return badRequest({ message: 'O email fornecido é invalido.' })
            }

            const emailUsed = await this.userRepository.getUserByEmail(email)
            if (emailUsed) {
                return badRequest({ message: 'O email já está em uso.' })
            }

            const hashPassword = await this.bcryptAdapter.generatePassword(password)
            const user = await this.userRepository.save({ name, email, password: hashPassword, phone, type: 'user' })
            const token = this.jwtAdapter.generateToken({ id: user.id })
            return ok({ token })
        } catch (error) {
            // console.log(error)
            return serverError()
        }
    }
}
