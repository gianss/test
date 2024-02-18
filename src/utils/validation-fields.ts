import mongoose from 'mongoose'

export interface ValidationFieldsInterface {
    validateMissingField(requiredFields: string[], request: any): string | null
    validateNumberType(requiredFields: string[], request: any): string | null
    validateEnum(field: string, fieldsObject: any, fieldName: string): string | null
    validateObjectId(value: string[], request: any): string | null
}

export class ValidationFields implements ValidationFieldsInterface {
    validateMissingField(requiredFields: string[], request: any): string | null {
        const missingFields: string[] = []
        for (const field of requiredFields) {
            if (!request[field]) {
                missingFields.push(field)
            }
        }
        if (missingFields.length > 0) {
            return `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`
        }
        return null
    }

    validateNumberType(requiredFields: string[], request: any): string | null {
        const invalidFields: string[] = []
        const numberRegex = /^-?\d*\.?\d+$/ // Expressão regular para números
        for (const field of requiredFields) {
            const fieldValue = request[field]
            if (typeof fieldValue === 'string' && !numberRegex.test(fieldValue)) {
                invalidFields.push(field)
            }
        }
        if (invalidFields.length > 0) {
            return `Os seguintes campos estão em formato inválido: ${invalidFields.join(', ')}`
        }
        return null
    }

    validateEnum(field: string, fieldsObject: any, fieldName: string): string | null {
        if (!(field in fieldsObject)) {
            return `O campo ${fieldName} só aceita os valores: ${Object.keys(fieldsObject).join(', ')}.`
        }
        return null
    }

    validateObjectId(values: string[], request: any): string | null {
        const invalidFields: string[] = []
        for (const value of values) {
            if (!mongoose.Types.ObjectId.isValid(request[value])) {
                invalidFields.push(value)
            }
        }
        if (invalidFields.length > 0) {
            return `Os seguintes campos estão no formato invalido: ${invalidFields.join(', ')}`
        }
        return null
    }
}
