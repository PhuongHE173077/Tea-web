import { StatusCodes } from "http-status-codes";
import { rbacController } from "~/controllers/rbac.controller";
import { roleService } from "~/services/role.service";
const { default: ApiError } = require("~/utils/ApiError");
const AccessControl = require('accesscontrol');

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const userRole = req.jwtDecoded?.role;
            if (!userRole) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, "Role not found in user.");
            }
            const rbac = new AccessControl();
            // roleService.getRoleList returns an array of grants: { role, resource, action, attributes }
            rbac.setGrants(await roleService.getRoleList());

            const roleName = typeof userRole === 'string' ? userRole : (userRole?.rol_name || userRole?.role || 'user');
            const permission = rbac.can(roleName)[action](resource);
            if (!permission.granted) {
                return next(new ApiError(StatusCodes.FORBIDDEN, "You don't have enough permission to access!"));
            }
            return next();
        } catch (error) {
            next(error)
        }
    }
}

export const rbacMiddlewares = {
    grantAccess
}