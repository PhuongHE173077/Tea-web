const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const ApiError = require("~/utils/ApiError").default;

const createBlog = async (req, res, next) => {
    try {
        const schema = Joi.object({
            blog_status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
            blog_title: Joi.alternatives().conditional('blog_status', {
                is: 'draft',
                then: Joi.string().trim().min(1).max(200).required(),
                otherwise: Joi.string().trim().min(5).max(200).required()
            }),
            blog_content: Joi.alternatives().conditional('blog_status', {
                is: 'draft',
                then: Joi.string().min(1).required(),
                otherwise: Joi.string().min(50).required()
            }),
            blog_excerpt: Joi.string().optional().min(10).max(500), // optional
            blog_thumbnail: Joi.object({
                url: Joi.string().uri().optional(),
                alt: Joi.string().optional().default('')
            }).optional(),
            blog_category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
            blog_tags: Joi.array().items(Joi.string().trim()).optional(),
            blog_meta: Joi.object({
                title: Joi.string().allow('', null).optional().max(60),
                description: Joi.string().allow('', null).optional().max(160),
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
            blog_status: Joi.string().valid('draft', 'published', 'archived').optional(),
            blog_title: Joi.alternatives().conditional('blog_status', {
                is: 'draft',
                then: Joi.string().trim().min(1).max(200),
                otherwise: Joi.string().trim().min(5).max(200)
            }).optional(),
            blog_content: Joi.alternatives().conditional('blog_status', {
                is: 'draft',
                then: Joi.string().min(1),
                otherwise: Joi.string().min(50)
            }).optional(),
            blog_excerpt: Joi.string().min(10).max(500).optional(),
            blog_thumbnail: Joi.object({
                url: Joi.string().uri().optional(),
                alt: Joi.string().optional()
            }).optional(),
            blog_category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
            blog_tags: Joi.array().items(Joi.string().trim()).optional(),
            blog_meta: Joi.object({
                title: Joi.string().allow('', null).optional().max(60),
                description: Joi.string().allow('', null).optional().max(160),
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
