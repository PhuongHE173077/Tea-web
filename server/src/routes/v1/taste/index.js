import express from 'express'
import { TasteController } from '~/controllers/taste.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .get(TasteController.getTastes)
    .post(authMiddlewares.isAuthorized, TasteController.createTaste)

router.route('/:id')
    .put(authMiddlewares.isAuthorized, TasteController.updateTaste)
    .delete(authMiddlewares.isAuthorized, TasteController.deleteTaste)

export const tasteRoutes = router