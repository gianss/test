import { validate } from 'email-validator'

export interface EmailValidationInterface {
    validate(email: string): boolean
}

export class EmailValidation implements EmailValidationInterface {
    validate(email: string): boolean {
        return validate(email)
    }
}
