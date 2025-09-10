import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'
import { cloudinaryProvider } from '~/providers/CloudinaryProvider'



const Router = express.Router()

Router.route('/upload')
    .post(multerUploadMiddlewares.upload.single('image'), async (req, res, next) => {
        try {
            const imageCoverFile = req.file
            const resultUpload = await cloudinaryProvider.streamUpload(imageCoverFile.buffer, 'images')
            res.status(StatusCodes.OK).json(resultUpload.secure_url)
        } catch (error) {
            next(error)
        }
    })

// Route mới để upload nhiều file cùng lúc
Router.route('/upload-multiple')
    .post(multerUploadMiddlewares.upload.array('images', 10), async (req, res, next) => {
        try {
            const imageFiles = req.files
            if (!imageFiles || imageFiles.length === 0) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No files uploaded' })
            }

            // Upload tất cả files song song
            const uploadPromises = imageFiles.map(file =>
                cloudinaryProvider.streamUpload(file.buffer, 'images')
            )

            const uploadResults = await Promise.all(uploadPromises)
            const imageUrls = uploadResults.map(result => result.secure_url)

            res.status(StatusCodes.OK).json(imageUrls)
        } catch (error) {
            next(error)
        }
    })

export const imageRouter = Router