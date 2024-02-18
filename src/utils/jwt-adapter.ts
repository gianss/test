import { sign, verify } from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export interface JwtAdapterInterface {
    generateToken(data: { id: string }): string
    decodeToken(data: string): { id: string }
}

export class JwtAdapter implements JwtAdapterInterface {
    generateToken(data: { id: string }): string {
        return sign(data, process.env.JWT_KEY, { expiresIn: '1h' })
    }

    decodeToken(data: string): any {
        return verify(data, process.env.JWT_KEY)
    }
}
