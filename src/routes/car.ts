import { Router } from 'express'
import { CarMiddleware } from '@/middleware/car-middleware'
import { AuthMiddleware } from '@/middleware/auth-middleware'
import { UploadAdapter } from '@/utils/upload-adapter'

const route = Router()
const { save, list, finish } = new CarMiddleware()
const { checkPermissions } = new AuthMiddleware()
const uploadAdapter = new UploadAdapter().upload()

route.get('/', list)
route.post('/', checkPermissions(['root']), uploadAdapter.array('photos'), save)
route.put('/finish-auction/:id', checkPermissions(['root']), finish)

export default route
