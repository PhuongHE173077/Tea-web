const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { default: ApiError } = require("~/utils/ApiError");

// Schema cho header section
const headerSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Header title is required',
        'any.required': 'Header title is required'
    }),
    detail: Joi.string().required().messages({
        'string.empty': 'Header detail is required',
        'any.required': 'Header detail is required'
    }),
    imageCover: Joi.string().required().messages({
        'string.empty': 'Header image cover is required',
        'any.required': 'Header image cover is required'
    }),
    attribute: Joi.array().default([]),
    isActive: Joi.boolean().default(true)
});

// Schema cho about section
const aboutSectionSchema = Joi.object({
    title: Joi.string().required(),
    detail: Joi.string().required(),
    attribute: Joi.array().items(
        Joi.object({
            icon: Joi.string().required(),
            title: Joi.string().required(),
            detail: Joi.string().required()
        })
    ).default([]),
    isActive: Joi.boolean().default(true)
});

// Schema cho video section
const videoSchema = Joi.object({
    url: Joi.string().required(),
    isActive: Joi.boolean().default(true)
});

// Schema cho main section
const mainSectionSchema = Joi.array().items(
    Joi.object({
        title: Joi.string().required(),
        detail: Joi.string().required(),
        imageCover: Joi.string().required(),
        isActive: Joi.boolean().default(true)
    })
);

// Schema cho event section
const eventSectionSchema = Joi.object({
    tag: Joi.array().default([]),
    title: Joi.string().required(),
    detail: Joi.string().required(),
    imageCol1: Joi.array().default([]),
    imageCol2: Joi.array().default([]),
    subSection: Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            detail: Joi.string().required()
        })
    ).default([]),
    isActive: Joi.boolean().default(true)
});

// Schema cho carousel section
const carouselSchema = Joi.object({
    title: Joi.string().required(),
    detail: Joi.string().required(),
    carouselList: Joi.array().default([]),
    isActive: Joi.boolean().default(true)
});

// Schema cho toàn bộ landing page
const createLandingPageSchema = Joi.object({
    header: headerSchema.required(),
    aboutSection: aboutSectionSchema.required(),
    video: videoSchema.required(),
    mainSection: mainSectionSchema.required(),
    eventSection: eventSectionSchema.required(),
    carousel: carouselSchema.required()
});

// Schema cho update (tất cả fields optional)
const updateLandingPageSchema = Joi.object({
    header: headerSchema.optional(),
    aboutSection: aboutSectionSchema.optional(),
    video: videoSchema.optional(),
    mainSection: mainSectionSchema.optional(),
    eventSection: eventSectionSchema.optional(),
    carousel: carouselSchema.optional()
});

const validateCreateLandingPage = async (req, res, next) => {
    try {
        await createLandingPageSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const validateUpdateLandingPage = async (req, res, next) => {
    try {
        await updateLandingPageSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const validateUpdateHeader = async (req, res, next) => {
    try {
        await headerSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const validateUpdateAboutSection = async (req, res, next) => {
    try {
        await aboutSectionSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const validateUpdateVideo = async (req, res, next) => {
    try {
        await videoSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const validateUpdateMainSection = async (req, res, next) => {
    try {
        await mainSectionSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const validateUpdateEventSection = async (req, res, next) => {
    try {
        await eventSectionSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const validateUpdateCarousel = async (req, res, next) => {
    try {
        await carouselSchema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

module.exports = {
    validateCreateLandingPage,
    validateUpdateLandingPage,
    validateUpdateHeader,
    validateUpdateAboutSection,
    validateUpdateVideo,
    validateUpdateMainSection,
    validateUpdateEventSection,
    validateUpdateCarousel
};
