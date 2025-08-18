import { StatusCodes } from "http-status-codes"
import { resourceService } from "~/services/resource.service"
import { roleService } from "~/services/role.service"

const createRole = async (req, res, next) => {
    try {
        const newRole = await roleService.createRole(req.body)
        res.status(StatusCodes.CREATED).json(newRole)
    } catch (error) {
        next(error)
    }
}

const createResource = async (req, res, next) => {
    try {
        const newRole = await resourceService.createResource(req.body)
        res.status(StatusCodes.CREATED).json(newRole)
    } catch (error) {
        next(error)
    }
}

const getRoleList = async (req, res, next) => {
    try {

        const listRoles = await roleService.getRoleList(req.body)
        res.status(StatusCodes.OK).json(listRoles)
    } catch (error) {
        next(error)
    }
}

const getResourceList = async (req, res, next) => {
    try {
        const listResources = await resourceService.getResourceList(req.body)
        res.status(StatusCodes.OK).json(listResources)
    } catch (error) {
        next(error)
    }
}

export const rbacController = {
    createRole,
    createResource,
    getRoleList,
    getResourceList
}