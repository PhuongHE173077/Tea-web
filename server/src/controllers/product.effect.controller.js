import { StatusCodes } from "http-status-codes"
import ProductEffect from "~/models/product.effect"

export const productEffectController = {
    getEffects: async (req, res, next) => {
        try {
            const effects = await ProductEffect.find()
            res.status(StatusCodes.OK).json(effects)
        } catch (error) {
            next(error)
        }
    },

    createEffect: async (req, res, next) => {
        try {
            console.log(req.body);

            const newEffect = await ProductEffect.create(req.body)
            res.status(StatusCodes.CREATED).json(newEffect)
        } catch (error) {
            next(error)
        }
    },

    updateEffect: async (req, res, next) => {
        try {
            const { id } = req.params
            const updateNew = await ProductEffect.updateOne({ _id: id }, req.body)
            res.status(StatusCodes.OK).json(updateNew)
        } catch (error) {
            next(error)
        }
    },

    deleteEffect: async (req, res, next) => {
        try {
            const { id } = req.params
            await ProductEffect.deleteOne({ _id: id })
            res.status(StatusCodes.OK).json({ message: "Effect deleted successfully" })
        } catch (error) {
            next(error)
        }
    },



}