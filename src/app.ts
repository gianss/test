import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import routes from '@/routes'
import { swaggerDefinition } from '@/documentation/swagger'

export const app = express()

const options = {
    swaggerDefinition,
    apis: ['./src/documentation/*.yaml']
}
app.use('/public', express.static('public'))
const custom = { customCssUrl: '/public/swagger-custom.css' }

const sawggerSpec = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(sawggerSpec, custom))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))

app.use('/', routes)
