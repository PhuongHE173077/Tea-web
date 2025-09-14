import axiosCustomize from "@/services/axios.customize";

export const fetchTeaCategoryAPIs = async () => {
    return await axiosCustomize.get("/tea-categories");
};

export const createTeaCategoryAPIs = async (data: {
    tea_category_name: string;
    tea_category_description: string;
    status: "active" | "inactive";
}) => {
    return await axiosCustomize.post("/tea-categories", data);
};

export const updateTeaCategoryAPIs = async (id: string, data: {
    tea_category_name: string;
    tea_category_description: string;
    status: "active" | "inactive";
}) => {
    return await axiosCustomize.post(`/tea-categories/${id}`, data);
};

export const deleteTeaCategoryAPIs = async (id: string) => {
    return await axiosCustomize.delete(`/tea-categories/${id}`);
};