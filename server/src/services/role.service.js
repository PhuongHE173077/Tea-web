import Role from "~/models/role.model"
import ApiError from "~/utils/ApiError"

const createRole = async (role) => {
    try {
        //1 . check role exist
        const roleExist = await Role.findOne({ rol_slug: role.rol_slug })
        if (roleExist) {
            throw new ApiError(400, "Role already exist")
        }

        //2. create role
        const result = await Role.create({
            rol_name: role.rol_name,
            rol_slug: role.rol_slug,
            rol_description: role.rol_description,
            rol_grants: role.rol_grants
        })
        return result
    } catch (error) {
        throw error
    }
}

const getRoleList = async (userId,
    limit = 30,
    offset = 0,
    search = ''
) => {
    try {

        const roles = await Role.aggregate([
            {
                $unwind: '$rol_grants'
            },
            {
                $lookup: {
                    from: 'Resources',
                    localField: 'rol_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            }, {
                $unwind: '$resource'
            },
            {
                $project: {
                    'role': '$rol_name',
                    'slug': '$rol_slug',
                    'description': '$rol_description',
                    'status': '$rol_status',
                    'resource': '$resource.src_name',
                    'action': '$rol_grants.actions',
                    'attributes': '$rol_grants.attributes',
                }
            },
            {
                $unwind: '$action'
            }
        ])


        return roles

    } catch (error) {
        return error
    }
}

export const roleService = {
    createRole,
    getRoleList
}