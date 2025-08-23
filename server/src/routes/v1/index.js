import express from 'express'

import { userRoutes } from './user'
import { rbacRoutes } from './rbac'
import { authRoutes } from './auth'
import { categoryRoutes } from './category'


const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Api v1 is ready' })
})

//auth APIs
Router.use('/', authRoutes)

//user APIs
Router.use('/user', userRoutes)

//rbac APIs
Router.use('/rbac', rbacRoutes)

//category APIs
Router.use('/category', categoryRoutes)


export const APIs_V1 = Router