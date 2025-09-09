import axiosCustomize from "@/services/axios.customize"

export const createImageUrl = async (data: any) => {
    return await axiosCustomize.post('/images/upload', data)
}

