import express from 'express'
import { productEffectController } from '~/controllers/product.effect.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .get(productEffectController.getEffects)
    .post(authMiddlewares.isAuthorized, productEffectController.createEffect)

router.route('/:id')
    .put(authMiddlewares.isAuthorized, productEffectController.updateEffect)
    .delete(authMiddlewares.isAuthorized, productEffectController.deleteEffect)

export const effectRoutes = router