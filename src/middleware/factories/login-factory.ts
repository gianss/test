import { LoginController } from '@/controllers/auth/login-controller'
import { UserRepository } from '@/repositories/user-repository'
import { BcryptAdapter } from '@/utils/bcrypt-adapter'
import { EmailValidation } from '@/utils/email-validator'
import { JwtAdapter } from '@/utils/jwt-adapter'
import { ValidationFields } from '@/utils/validation-fields'

export const LoginControllerFactory = (): LoginController => {
    const userRepository = new UserRepository()
    const emailValidation = new EmailValidation()
    const validationFields = new ValidationFields()
    const bcryptAdapter = new BcryptAdapter(5)
    const jwtAdapter = new JwtAdapter()
    return new LoginController(userRepository, emailValidation, validationFields, bcryptAdapter, jwtAdapter)
}
