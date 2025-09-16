const { StatusCodes } = require("http-status-codes");
import Blog from '~/models/blog.model';
import ApiError from '~/utils/ApiError';
import { slugify } from '~/utils/slugify';

// Tính toán thời gian đọc (khoảng 200 từ/phút)
const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
};

// Tạo slug unique
const generateUniqueSlug = async (title) => {
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    
    while (await Blog.exists({ blog_slug: slug }).lean()) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    
    return slug;
};

const getAllBlogs = async (query) => {
    try {
        const {
            page = 1,
            limit = 10,
            status = 'published',
            category,
            author,
            featured,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = query;

        // Build filter object
        const filter = {};
        
        if (status) filter.blog_status = status;
        if (category) filter.blog_category = category;
        if (author) filter.blog_author = author;
        if (featured !== undefined) filter.blog_featured = featured === 'true';
        
        // Search functionality
        if (search) {
            filter.$text = { $search: search };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const blogs = await Blog.find(filter)
            .populate('blog_author', 'usr_name usr_avatar usr_email')
            .populate('blog_category', 'category_name category_slug')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(total / parseInt(limit));

        return {
            blogs,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            }
        };
    } catch (error) {
        throw error;
    }
};

const getBlogById = async (id) => {
    try {
        const blog = await Blog.findById(id)
            .populate('blog_author', 'usr_name usr_avatar usr_email')
            .populate('blog_category', 'category_name category_slug')
            .lean();

        if (!blog) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
        }

        return blog;
    } catch (error) {
        throw error;
    }
};

const getBlogBySlug = async (slug) => {
    try {
        const blog = await Blog.findOne({ blog_slug: slug })
            .populate('blog_author', 'usr_name usr_avatar usr_email')
            .populate('blog_category', 'category_name category_slug')
            .lean();

        if (!blog) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
        }

        return blog;
    } catch (error) {
        throw error;
    }
};

const createBlog = async (data, authorId) => {
    try {
        // Generate unique slug
        const slug = await generateUniqueSlug(data.blog_title);
        
        // Calculate reading time
        const readingTime = calculateReadingTime(data.blog_content);

        const blogData = {
            ...data,
            blog_slug: slug,
            blog_author: authorId,
            blog_reading_time: readingTime,
            blog_published_at: data.blog_status === 'published' ? new Date() : null
        };

        const newBlog = await Blog.create(blogData);
        
        return await Blog.findById(newBlog._id)
            .populate('blog_author', 'usr_name usr_avatar usr_email')
            .populate('blog_category', 'category_name category_slug')
            .lean();
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog with this slug already exists');
        }
        throw error;
    }
};

const updateBlog = async (id, data) => {
    try {
        const existingBlog = await Blog.findById(id);
        
        if (!existingBlog) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
        }

        // If title changed, generate new slug
        if (data.blog_title && data.blog_title !== existingBlog.blog_title) {
            data.blog_slug = await generateUniqueSlug(data.blog_title);
        }

        // Recalculate reading time if content changed
        if (data.blog_content) {
            data.blog_reading_time = calculateReadingTime(data.blog_content);
        }

        // Set published date if status changed to published
        if (data.blog_status === 'published' && existingBlog.blog_status !== 'published') {
            data.blog_published_at = new Date();
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        )
        .populate('blog_author', 'usr_name usr_avatar usr_email')
        .populate('blog_category', 'category_name category_slug')
        .lean();

        return updatedBlog;
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog with this slug already exists');
        }
        throw error;
    }
};

const deleteBlog = async (id) => {
    try {
        const blog = await Blog.findById(id);
        
        if (!blog) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
        }

        await Blog.findByIdAndDelete(id);
        
        return { message: 'Blog deleted successfully' };
    } catch (error) {
        throw error;
    }
};

const incrementViews = async (id) => {
    try {
        await Blog.findByIdAndUpdate(id, { $inc: { blog_views: 1 } });
    } catch (error) {
        throw error;
    }
};

export const blogService = {
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    incrementViews
};
