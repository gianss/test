import { JwtAdapterInterface } from '@/utils/jwt-adapter'

export class JwtAdapterSpy implements JwtAdapterInterface {
    generateToken(data: { id: string }): string {
        return 'any_hash'
    }

    decodeToken(data: string): any {
        return {}
    }
}
