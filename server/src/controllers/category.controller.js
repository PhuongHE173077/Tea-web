import { StatusCodes } from "http-status-codes"
import { categoryService } from "~/services/category.service"
import { slugify } from "~/utils/slugify"

const createNew = async (req, res, next) => {
    try {
        const newCategory = {
            category_name: req.body.category_name,
            category_slug: slugify(req.body.category_name),
            category_icon: req.body.category_icon,
            category_image: req.body.category_image,
            category_description: req.body.category_description,
            status: req.body.status || "active"
        }
        const createdCategory = await categoryService.createCategory(newCategory)
        res.status(StatusCodes.CREATED).json(createdCategory)
    } catch (error) {
        next(error)
    }
}

const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories()
        res.status(StatusCodes.OK).json(categories)
    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params

        const updateNew = await categoryService.updateCategory(id, req.body)
        res.status(StatusCodes.OK).json(updateNew)
    } catch (error) {
        next(error)
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        await categoryService.deleteCategory(id)
        res.status(StatusCodes.OK).json({ message: "Category deleted successfully" })
    } catch (error) {
        next(error)
    }
}

export const categoryController = {
    createNew,
    getCategories,
    updateCategory,
    deleteCategory
}