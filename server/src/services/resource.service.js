import Resource from "~/models/resource.model"
import ApiError from "~/utils/ApiError"
import { slugify } from "~/utils/slugify"

const createResource = async (
    data
) => {
    try {
        //1. check slug exist

        const dataNew = {
            src_name: data.src_name,
            src_slug: slugify(data.src_name),
            src_description: data.src_description
        }

        const resourceExist = await Resource.findOne({ src_slug: dataNew.src_slug })
        if (resourceExist) {
            throw new ApiError(400, "Resource already exist")
        }

        //2. create resource
        const result = await Resource.create(dataNew)

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