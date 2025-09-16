import { StatusCodes } from "http-status-codes";
import { blogService } from "~/services/blog.service";

const getAllBlogs = async (req, res, next) => {
    try {
        const result = await blogService.getAllBlogs(req.query);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Blogs retrieved successfully',
            data: result.blogs,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

const getBlogById = async (req, res, next) => {
    try {
        const blog = await blogService.getBlogById(req.params.id);
        
        // Increment views count
        await blogService.incrementViews(req.params.id);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Blog retrieved successfully',
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

const getBlogBySlug = async (req, res, next) => {
    try {
        const blog = await blogService.getBlogBySlug(req.params.slug);
        
        // Increment views count
        await blogService.incrementViews(blog._id);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Blog retrieved successfully',
            data: blog
        });
    } catch (error) {
        next(error);
    }
};

const createBlog = async (req, res, next) => {
    try {
        const authorId = req.jwtDecoded._id; // Lấy từ JWT token
        const newBlog = await blogService.createBlog(req.body, authorId);
        
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Blog created successfully',
            data: newBlog
        });
    } catch (error) {
        next(error);
    }
};

const updateBlog = async (req, res, next) => {
    try {
        const updatedBlog = await blogService.updateBlog(req.params.id, req.body);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog
        });
    } catch (error) {
        next(error);
    }
};

const deleteBlog = async (req, res, next) => {
    try {
        const result = await blogService.deleteBlog(req.params.id);
        
        res.status(StatusCodes.OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};

export const blogController = {
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog
};
