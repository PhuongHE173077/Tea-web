import express from 'express'
import { rbacController } from '~/controllers/rbac.controller'


const router = express.Router()

router.route('/role')
    .post(rbacController.createRole)

router.route('/resource')
    .post(rbacController.createResource)

router.route('/roles')
    .get(rbacController.getRoleList)

router.route('/resources')
    .get(rbacController.getResourceList)

export const rbacRoutes = router
