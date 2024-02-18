import { BcryptAdapterInterface } from '@/utils/bcrypt-adapter'

export class BcryptAdapterSpy implements BcryptAdapterInterface {
    async generatePassword(password: string): Promise<string> {
        return 'any_hash'
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return true
    }
}
