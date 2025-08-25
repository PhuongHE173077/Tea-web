import express from 'express'
import { categoryController } from '~/controllers/category.controller'
import { userController } from '~/controllers/user.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'


const router = express.Router()

router.route('/')
    .get(categoryController.getCategories)
    .post(authMiddlewares.isAuthorized, categoryController.createNew)

router.route('/:id')
    .post(authMiddlewares.isAuthorized, categoryController.updateCategory)
    .delete(authMiddlewares.isAuthorized, categoryController.deleteCategory)

export const categoryRoutes = router