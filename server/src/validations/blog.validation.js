const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const ApiError = require("~/utils/ApiError").default;

const createBlog = async (req, res, next) => {
    try {
        const schema = Joi.object({
            blog_title: Joi.string().required().min(5).max(200).trim(),
            blog_content: Joi.string().required().min(50),
            blog_excerpt: Joi.string().required().min(10).max(500),
            blog_thumbnail: Joi.object({
                url: Joi.string().uri().optional(),
                alt: Joi.string().optional().default('')
            }).optional(),
            blog_category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
            blog_tags: Joi.array().items(Joi.string().trim()).optional(),
            blog_status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
            blog_meta: Joi.object({
                title: Joi.string().optional().max(60),
                description: Joi.string().optional().max(160),
                keywords: Joi.array().items(Joi.string()).optional()
            }).optional(),
            blog_featured: Joi.boolean().optional().default(false)
        });

        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const updateBlog = async (req, res, next) => {
    try {
        const schema = Joi.object({
            blog_title: Joi.string().min(5).max(200).trim().optional(),
            blog_content: Joi.string().min(50).optional(),
            blog_excerpt: Joi.string().min(10).max(500).optional(),
            blog_thumbnail: Joi.object({
                url: Joi.string().uri().optional(),
                alt: Joi.string().optional()
            }).optional(),
            blog_category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
            blog_tags: Joi.array().items(Joi.string().trim()).optional(),
            blog_status: Joi.string().valid('draft', 'published', 'archived').optional(),
            blog_meta: Joi.object({
                title: Joi.string().optional().max(60),
                description: Joi.string().optional().max(160),
                keywords: Joi.array().items(Joi.string()).optional()
            }).optional(),
            blog_featured: Joi.boolean().optional()
        });

        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

const getBlogById = async (req, res, next) => {
    try {
        const schema = Joi.object({
            id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
        });

        await schema.validateAsync(req.params, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid blog ID format'));
    }
};

const getBlogs = async (req, res, next) => {
    try {
        const schema = Joi.object({
            page: Joi.number().integer().min(1).optional(),
            limit: Joi.number().integer().min(1).max(100).optional(),
            status: Joi.string().valid('draft', 'published', 'archived').optional(),
            category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
            author: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
            featured: Joi.string().valid('true', 'false').optional(),
            search: Joi.string().optional(),
            sortBy: Joi.string().valid('createdAt', 'updatedAt', 'blog_title', 'blog_views', 'blog_likes').optional(),
            sortOrder: Joi.string().valid('asc', 'desc').optional()
        });

        await schema.validateAsync(req.query, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};

export const blogValidation = {
    createBlog,
    updateBlog,
    getBlogById,
    getBlogs
};
