const createNew = async (data) => {
    try {
        //1. check if Shop exist
        const shopExist = await Shop.findOne({ shop_slug: data.shop_slug })
        if (!shopExist) {
            throw new ApiError(400, "Shop not exist")
        }

    } catch (error) {
        throw error
    }
}

export const spuService = {
    createNew
}