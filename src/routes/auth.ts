import { Router } from 'express'
import { AuthMiddleware } from '@/middleware/auth-middleware'

const route = Router()
const { login } = new AuthMiddleware()

route.post('/login', login)

export default route
