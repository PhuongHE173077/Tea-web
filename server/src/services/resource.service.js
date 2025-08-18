import Resource from "~/models/resource.model"
import ApiError from "~/utils/ApiError"

const createResource = async (
    {
        name = 'profile',
        slug = 'p00001',
        description = ''
    }
) => {
    try {
        //1. check slug exist

        const resourceExist = await Resource.findOne({ src_slug: slug })
        if (resourceExist) {
            throw new ApiError(400, "Resource already exist")
        }

        //2. create resource
        const result = await Resource.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        })

        return result
    } catch (error) {
        throw error
    }
}

const getResourceList = async (
    userId = 0,
    limit = 30,
    offset = 0,
    search = '',
) => {
    try {
        //1. check amin 

        //2. get list resource
        const resource = await Resource.aggregate([
            {
                $facet: {
                    'data': [
                        { $skip: offset },
                        { $limit: limit },
                    ],
                    'count': [
                        { $count: 'total' }
                    ]
                }
            }
        ])

        const res = resource[0]
        const count = res?.count[0]?.total || 0

        return {
            data: res?.data || [],
            total: count
        }

    } catch (error) {
        return []
    }
}


export const resourceService = {
    createResource,
    getResourceList
}