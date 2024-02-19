import { badRequest, ok, serverError } from '@/utils/http-helper'
import { HttpResponse } from '@/models/interfaces/http-response'
import { CarRequest } from '@/models/dtos/car-request'
import { CarResponse } from '@/models/dtos/car-response'
import { CarRepositoryInterface } from '@/repositories/car-repository'
import { ValidationFieldsInterface } from '@/utils/validation-fields'

export class AddCarController {
    constructor(
        private readonly carRepository: CarRepositoryInterface,
        private readonly validationFields: ValidationFieldsInterface
    ) { }

    async handle(request: CarRequest): Promise<HttpResponse> {
        try {
            const missingFields = this.validationFields.validateMissingField([
                'brand', 'carModel', 'year', 'mileage', 'color', 'fuelType', 'transmissionType', 'initialBid', 'location'
            ], request)
            if (missingFields) {
                return badRequest({ message: missingFields })
            }

            const invalidNumberFields = this.validationFields.validateNumberType(['year', 'mileage', 'initialBid'], request)
            if (invalidNumberFields) {
                return badRequest({ message: invalidNumberFields })
            }

            const { brand, carModel, year, mileage, color, fuelType, transmissionType, initialBid, location, photos } = request

            const car = await this.carRepository.save({
                brand,
                carModel,
                year,
                mileage,
                color,
                fuelType,
                transmissionType,
                initialBid,
                location,
                status: 'disponivel',
                photos
            })
            const carResponse: CarResponse = {
                id: car._id,
                brand: car.brand,
                carModel: car.carModel,
                year: car.year,
                location: car.location,
                status: car.status,
                mileage: car.mileage,
                color: car.color,
                fuelType: car.fuelType,
                registration_date: car.registration_date,
                transmissionType: car.transmissionType,
                initialBid: car.initialBid,
                photos: car.photos
            }
            return ok({ data: carResponse })
        } catch (error) {
            return serverError()
        }
    }
}
