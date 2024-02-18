import { Request, Response } from 'express'
import { addCarControllerFactory, finishAuctionCarControllerFactory, listCarControllerFactory } from './factories/car-factory'
import { CarRequest } from '@/models/dtos/car-request'

export class CarMiddleware {
    save = async (req: Request, res: Response): Promise<void> => {
        const carController = addCarControllerFactory()
        let photos: Express.Multer.File[] = []
        if (Array.isArray(req.files)) {
            photos = req.files
        }
        const processedPhotos = photos.map((photo: Express.Multer.File): any => {
            return {
                path: photo.path,
                name: photo.originalname,
                size: photo.size
            }
        })
        const request: CarRequest = { ...req.body, photos: processedPhotos }
        const response = await carController.handle(request)
        res.status(response.statusCode).json(response.body)
    }

    finish = async (req: Request, res: Response): Promise<void> => {
        const carController = finishAuctionCarControllerFactory()
        const response = await carController.handle(req.params.id)
        res.status(response.statusCode).json(response.body)
    }

    list = async (req: Request, res: Response): Promise<void> => {
        const carController = listCarControllerFactory()
        const response = await carController.handle(req.query)
        res.status(response.statusCode).json(response.body)
    }
}
