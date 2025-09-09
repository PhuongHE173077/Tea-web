import express from 'express'
import { spuController } from '~/controllers/spu.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .post(authMiddlewares.isAuthorized, spuController.createNew)
    .get(spuController.getAllSpu)

router.route('/:id')
    .put(authMiddlewares.isAuthorized, spuController.updateById)
    .delete(authMiddlewares.isAuthorized, spuController.deleteById)

router.route('/:slug')
    .get(spuController.getBySlug)

export const productRoutes = router