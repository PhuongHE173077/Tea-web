import axiosCustomize from "@/services/axios.customize"

export const fetchEffect = async () => {
    return await axiosCustomize.get('/effects')
}

export const fetchTaste = async () => {
    return await axiosCustomize.get('/tastes')
}

export const createEffect = async (data: any) => {
    return await axiosCustomize.post('/effects', data)
}

export const createTaste = async (data: any) => {
    return await axiosCustomize.post('/tastes', data)
}

export const updateEffect = async (id: string, data: any) => {
    return await axiosCustomize.put(`/effects/${id}`, data)
}

export const updateTaste = async (id: string, data: any) => {
    return await axiosCustomize.put(`/tastes/${id}`, data)
}

export const deleteEffect = async (id: string) => {
    return await axiosCustomize.delete(`/effects/${id}`)
}

export const deleteTaste = async (id: string) => {
    return await axiosCustomize.delete(`/tastes/${id}`)
}