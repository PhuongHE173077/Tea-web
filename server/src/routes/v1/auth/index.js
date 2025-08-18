import express from 'express'
import { userController } from '~/controllers/user.controller'
import { userValidation } from '~/validations/user.validation'

const Router = express.Router()


Router.route('/login')
    .post(userValidation.login, userController.login)

Router.route('/register')
    .post(userValidation.createUser, userController.register)


export const authRoutes = Router