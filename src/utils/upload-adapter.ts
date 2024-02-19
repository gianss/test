import multer from 'multer'
import { existsSync, mkdirSync } from 'fs'

export class UploadAdapter {
    upload(): multer.Multer {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if (!existsSync('uploads')) {
                    mkdirSync('uploads', { recursive: true })
                }
                cb(null, 'uploads')
            },
            filename: function (req, file, cb) {
                cb(null, `${crypto.randomUUID()}-${file.originalname}`)
            }
        })
        return multer({ storage })
    }
}
