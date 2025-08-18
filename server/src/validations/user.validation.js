const { StatusCodes } = require("http-status-codes")
const Joi = require("joi")
const { default: ApiError } = require("~/utils/ApiError")

const createUser = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            userName: Joi.string().required(),
            confirmPassword: Joi.string().required(),
        })
        await schema.validateAsync(req.body, { abortEarly: false })

        if (req.body.password !== req.body.confirmPassword) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Password and confirm password not match')
        }
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

const login = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })
        await schema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
}

export const userValidation = {
    createUser,
    login
}