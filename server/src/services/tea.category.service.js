import TeaCategory from "~/models/tea.category"
import { slugify } from "~/utils/slugify"

const createTeaCategory = async (teaCategoryData) => {
    try {
        const newTeaCategory = new TeaCategory(teaCategoryData)
        const savedTeaCategory = await newTeaCategory.save()
        return savedTeaCategory
    } catch (error) {
        throw error
    }
}

const getAll = async () => {
    try {
        const teaCategories = await TeaCategory.find({ status: "active" }).sort({ createdAt: -1 })
        return teaCategories
    } catch (error) {
        throw error
    }
}

const updateTeaCategory = async (id, updateData) => {
    try {
        if (updateData.tea_category_name) {
            updateData.tea_category_slug = slugify(updateData.tea_category_name)
        }
        const updatedTeaCategory = await TeaCategory.findByIdAndUpdate(id, updateData, { new: true })
        return updatedTeaCategory
    } catch (error) {
        throw error
    }
}

const deleteTeaCategory = async (id) => {
    try {
        await TeaCategory.findByIdAndDelete(id)
    } catch (error) {
        throw error
    }
}

export const teaService = {
    createTeaCategory,
    getAll,
    updateTeaCategory,
    deleteTeaCategory
}