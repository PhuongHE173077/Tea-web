const { StatusCodes } = require("http-status-codes");
import Blog from '~/models/blog.model';
import ApiError from '~/utils/ApiError';
import { slugify } from '~/utils/slugify';
import MarkdownIt from 'markdown-it';

// Initialize markdown parser
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});

// Tính toán thời gian đọc (khoảng 200 từ/phút) từ markdown content
const calculateReadingTime = (markdownContent) => {
    const wordsPerMinute = 200;
    // Convert markdown to plain text để đếm từ chính xác hơn
    const plainText = md.render(markdownContent).replace(/<[^>]*>/g, '');
    const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / wordsPerMinute);
};

// Tạo excerpt từ markdown content
const generateExcerptFromMarkdown = (markdownContent, maxLength = 200) => {
    // Convert markdown to plain text
    const plainText = md.render(markdownContent).replace(/<[^>]*>/g, '');
    // Lấy đoạn đầu và cắt theo độ dài
    const excerpt = plainText.trim().substring(0, maxLength);
    return excerpt.length < plainText.length ? excerpt + '...' : excerpt;
};

// Tạo keywords từ content
const generateKeywordsFromContent = (markdownContent, maxKeywords = 10) => {
    const plainText = md.render(markdownContent).replace(/<[^>]*>/g, '');
    const words = plainText.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3); // Chỉ lấy từ có độ dài > 3

    // Đếm tần suất xuất hiện
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Sắp xếp theo tần suất và lấy top keywords
    return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, maxKeywords)
        .map(([word]) => word);
};

// Extract ảnh đầu tiên từ markdown content
const extractFirstImageFromMarkdown = (markdownContent) => {
    // Tìm markdown image syntax: ![alt](url)
    const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
    const markdownMatch = markdownContent.match(markdownImageRegex);

    if (markdownMatch) {
        return {
            url: markdownMatch[2],
            alt: markdownMatch[1] || 'Blog image'
        };
    }

    // Tìm HTML img tag: <img src="url" alt="alt" />
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/i;
    const htmlMatch = markdownContent.match(htmlImageRegex);

    if (htmlMatch) {
        return {
            url: htmlMatch[1],
            alt: htmlMatch[2] || 'Blog image'
        };
    }

    // Tìm HTML img tag đơn giản: <img src="url" />
    const simpleHtmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*\/?>/i;
    const simpleMatch = markdownContent.match(simpleHtmlImageRegex);

    if (simpleMatch) {
        return {
            url: simpleMatch[1],
            alt: 'Blog image'
        };
    }

    return null;
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

        // Calculate reading time from markdown content
        const readingTime = calculateReadingTime(data.blog_content);

        // Auto-generate excerpt from markdown content
        data.blog_excerpt = generateExcerptFromMarkdown(data.blog_content);

        // Auto-generate thumbnail from first image in markdown
        if (!data.blog_thumbnail) {
            const firstImage = extractFirstImageFromMarkdown(data.blog_content);
            if (firstImage) {
                data.blog_thumbnail = firstImage;
            }
        }

        // Auto-generate SEO meta if not provided
        if (!data.blog_meta) {
            data.blog_meta = {};
        }
        if (!data.blog_meta.title) {
            data.blog_meta.title = data.blog_title.substring(0, 60);
        }
        if (!data.blog_meta.description) {
            data.blog_meta.description = data.blog_excerpt.substring(0, 160);
        }
        if (!data.blog_meta.keywords || data.blog_meta.keywords.length === 0) {
            data.blog_meta.keywords = generateKeywordsFromContent(data.blog_content);
        }

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

            // Auto-update excerpt from markdown content
            data.blog_excerpt = generateExcerptFromMarkdown(data.blog_content);

            // Auto-update thumbnail from first image in markdown if not provided
            if (!data.blog_thumbnail) {
                const firstImage = extractFirstImageFromMarkdown(data.blog_content);
                if (firstImage) {
                    data.blog_thumbnail = firstImage;
                }
            }

            // Auto-update SEO meta
            if (!data.blog_meta) {
                data.blog_meta = existingBlog.blog_meta || {};
            }
            if (!data.blog_meta.keywords || data.blog_meta.keywords.length === 0) {
                data.blog_meta.keywords = generateKeywordsFromContent(data.blog_content);
            }
        }

        // Update meta title if title changed
        if (data.blog_title && (!data.blog_meta || !data.blog_meta.title)) {
            if (!data.blog_meta) data.blog_meta = existingBlog.blog_meta || {};
            data.blog_meta.title = data.blog_title.substring(0, 60);
        }

        // Update meta description if excerpt changed
        if (data.blog_excerpt && (!data.blog_meta || !data.blog_meta.description)) {
            if (!data.blog_meta) data.blog_meta = existingBlog.blog_meta || {};
            data.blog_meta.description = data.blog_excerpt.substring(0, 160);
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
