import { StatusCodes } from "http-status-codes"
import { categoryService } from "~/services/category.service"
import { slugify } from "~/utils/slugify"

const createNew = async (req, res, next) => {
    try {
        const newCategory = {
            category_name: req.body.name,
            category_slug: slugify(req.body.name),
            category_description: req.body.description,
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
export const categoryController = {
    createNew,
    getCategories
}