import express from 'express'
import { userController } from '~/controllers/user.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { rbacMiddlewares } from '~/middlewares/rbacMiddlewares'


const router = express.Router()

router.route('/viewAny')
    .get(authMiddlewares.isAuthorized, rbacMiddlewares.grantAccess('readAny', 'profile'), userController.viewAnyProfile)

router.route("/me")
    .get(authMiddlewares.isAuthorized, userController.viewMyProfile)

export const userRoutes = router
