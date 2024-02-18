import { hash, compare } from 'bcrypt'

export interface BcryptAdapterInterface {
    generatePassword(password: string): Promise<string>
    comparePassword(password: string, hash: string): Promise<boolean>
}

export class BcryptAdapter implements BcryptAdapterInterface {
    constructor(private readonly salt: number) { }

    async generatePassword(password: string): Promise<string> {
        return hash(password, this.salt)
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return compare(password, hash)
    }
}
