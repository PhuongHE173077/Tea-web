import express from 'express'

import { userRoutes } from './user'
import { rbacRoutes } from './rbac'
import { authRoutes } from './auth'
import { categoryRoutes } from './category'
import { productRoutes } from './product'
import { imageRouter } from './Image'
import { effectRoutes } from './effect'
import { tasteRoutes } from './taste'
import { discountRoutes } from './discount'


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
Router.use('/categories', categoryRoutes)

//product APIs
Router.use('/spus', productRoutes)

//product APIs
Router.use('/images', imageRouter)

Router.use('/effects', effectRoutes)

Router.use('/tastes', tasteRoutes)

//discount APIs
Router.use('/discount', discountRoutes)

export const APIs_V1 = Router