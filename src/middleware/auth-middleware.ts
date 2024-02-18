import { NextFunction, Request, Response } from 'express'
import { authFactoryController } from './factories/auth-factory'
import { LoginControllerFactory } from './factories/login-factory'
import { LoginRequest } from '@/models/dtos/login-request'

export class AuthMiddleware {
    checkPermissions = (roles: string[]) => {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const authController = authFactoryController()
            const response = await authController.authorize(req.headers['x-access-token']?.toString(), roles)
            if (response.statusCode !== 200) {
                res.status(response.statusCode).json(response.body)
            } else {
                req.user = response.body.user
                next()
            }
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const loginController = LoginControllerFactory()
        const request: LoginRequest = req.body
        const response = await loginController.handle(request)
        res.status(response.statusCode).json(response.body)
    }
}
