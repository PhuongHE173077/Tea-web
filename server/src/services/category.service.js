import Category from "~/models/category.model"

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

export const categoryService = {
    createCategory,
    getCategories
}