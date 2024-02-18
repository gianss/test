import { EmailValidationInterface } from '@/utils/email-validator'
import { ValidationFieldsInterface } from '@/utils/validation-fields'

export class ValidationFieldsSpy implements ValidationFieldsInterface {
    validateObjectId(value: string[]): string | null {
        return null
    }

    validateMissingField(requiredFields: string[], request: any): string | null {
        return null
    }

    validateNumberType(requiredFields: string[], request: any): string | null {
        return null
    }

    validateEnum(field: string, fieldsObject: any, fieldName: string): string | null {
        return null
    }
}

export class EmailValidationSpy implements EmailValidationInterface {
    validate(input: any): boolean {
        return true
    }
}
