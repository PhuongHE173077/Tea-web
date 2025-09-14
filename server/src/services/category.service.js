import Category from "~/models/category.model"
import { slugify } from "~/utils/slugify"

const createCategory = async (categoryData) => {
    try {
        const newCategory = new Category(categoryData)
        const savedCategory = await newCategory.save()
        return savedCategory
    } catch (error) {
        throw error
    }
}


const getCategories = async () => {
    try {
        const categories = await Category.find({ status: "active" }).sort({ createdAt: -1 })
        return categories
    } catch (error) {
        throw error
    }
}

const updateCategory = async (id, updateData) => {
    try {
        if (updateData.name) {
            updateData.category_name = updateData.name
            updateData.category_slug = slugify(updateData.name)
            delete updateData.name
        }
        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true })
        return updatedCategory
    } catch (error) {
        throw error
    }
}
const deleteCategory = async (id) => {
    try {
        await Category.findByIdAndDelete(id)
    } catch (error) {
        throw error
    }
}

const getBySlug = async (slug) => {
    try {
        const category = await Category.findOne({ category_slug: slug })
        return category
    } catch (error) {
        throw error
    }
}

export const categoryService = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getBySlug
}