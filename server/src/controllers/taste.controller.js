import { StatusCodes } from "http-status-codes"
import Taste from "~/models/taste.model"

export const TasteController = {
    getTastes: async (req, res, next) => {
        try {
            const tastes = await Taste.find()
            res.status(StatusCodes.OK).json(tastes)
        } catch (error) {
            next(error)
        }
    },

    createTaste: async (req, res, next) => {
        try {
            const newTaste = await Taste.create(req.body)
            res.status(StatusCodes.CREATED).json(newTaste)
        } catch (error) {
            next(error)
        }
    },

    updateTaste: async (req, res, next) => {
        try {
            const { id } = req.params
            const updateNew = await Taste.updateOne({ _id: id }, req.body)
            res.status(StatusCodes.OK).json(updateNew)
        } catch (error) {
            next(error)
        }
    },

    deleteTaste: async (req, res, next) => {
        try {
            const { id } = req.params
            await Taste.deleteOne({ _id: id })
            res.status(StatusCodes.OK).json({ message: "Taste deleted successfully" })
        } catch (error) {
            next(error)
        }
    },

}