import multer from 'multer'

export class UploadAdapter {
    upload(): multer.Multer {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'upload')
            },
            filename: function (req, file, cb) {
                cb(null, `${crypto.randomUUID()}-${file.originalname}`)
            }
        })
        return multer({ storage })
    }
}
