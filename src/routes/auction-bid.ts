import { Router } from 'express'
import { AuctionBidMiddleware } from '@/middleware/auction-bid-middleware'
import { AuthMiddleware } from '@/middleware/auth-middleware'

const route = Router()

const { save, list } = new AuctionBidMiddleware()
const { checkPermissions } = new AuthMiddleware()

route.post('/', checkPermissions(['user']), save)
route.get('/list/:id', list)

export default route
