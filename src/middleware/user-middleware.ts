import { Request, Response } from 'express'
import { addUserControllerFactory } from './factories/user-factory'
import { UserRequest } from '@/models/dtos/user-request'

export class UserMiddleware {
    save = async (req: Request, res: Response): Promise<void> => {
        const userController = addUserControllerFactory()
        const request: UserRequest = req.body
        const response = await userController.handle(request)
        res.status(response.statusCode).json(response.body)
    }
}
