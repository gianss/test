import { Router } from 'express'
import { UserMiddleware } from '../middleware/user-middleware'

const route = Router()
const { save } = new UserMiddleware()

route.post('/', save)

export default route
