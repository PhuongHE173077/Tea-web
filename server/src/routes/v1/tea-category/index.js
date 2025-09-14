import express from 'express'
import { teaController } from '~/controllers/tea.category.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const router = express.Router()

router.route('/')
    .get(teaController.getAll)
    .post(authMiddlewares.isAuthorized, teaController.createNew)

router.route('/:id')
    .post(authMiddlewares.isAuthorized, teaController.updateTeaCategory)
    .delete(authMiddlewares.isAuthorized, teaController.deleteTeaCategory)

export const teaCategoryRoutes = router