import { StatusCodes } from "http-status-codes"
import { teaService } from "~/services/tea.category.service"
import { slugify } from "~/utils/slugify"

const createNew = async (req, res, next) => {
    try {
        const newTeaCategory = {
            tea_category_name: req.body.tea_category_name,
            tea_category_slug: slugify(req.body.tea_category_name),
            tea_category_description: req.body.tea_category_description,
            status: req.body.status || "active"
        }
        const createdTeaCategory = await teaService.createTeaCategory(newTeaCategory)
        res.status(StatusCodes.CREATED).json(createdTeaCategory)
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await teaService.getAll()
        res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

const updateTeaCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        const updateNew = await teaService.updateTeaCategory(id, req.body)
        res.status(StatusCodes.OK).json(updateNew)
    } catch (error) {
        next(error)
    }
}

const deleteTeaCategory = async (req, res, next) => {
    try {
        const { id } = req.params
        await teaService.deleteTeaCategory(id)
        res.status(StatusCodes.OK).json({ message: "Tea category deleted successfully" })
    } catch (error) {
        next(error)
    }
}

export const teaController = {
    createNew,
    getAll,
    updateTeaCategory,
    deleteTeaCategory
}