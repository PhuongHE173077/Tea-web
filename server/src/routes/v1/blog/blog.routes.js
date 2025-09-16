import express from 'express';
import { blogController } from '~/controllers/blog.controller';
import { authMiddlewares } from '~/middlewares/authMiddlewares';
import { rbacMiddlewares } from '~/middlewares/rbacMiddlewares';
import { blogValidation } from '~/validations/blog.validation';

const router = express.Router();

/**
 * @route GET /api/blogs
 * @desc Get all blogs with pagination and filtering
 * @access Public
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10, max: 100)
 * @query {string} status - Filter by status (draft, published, archived)
 * @query {string} category - Filter by category ID
 * @query {string} author - Filter by author ID
 * @query {string} featured - Filter by featured status (true/false)
 * @query {string} search - Search in title, content, excerpt
 * @query {string} sortBy - Sort field (createdAt, updatedAt, blog_title, blog_views, blog_likes)
 * @query {string} sortOrder - Sort order (asc, desc)
 */
router.get('/', blogValidation.getBlogs, blogController.getAllBlogs);

/**
 * @route GET /api/blogs/:id
 * @desc Get blog by ID
 * @access Public
 * @param {string} id - Blog ID
 */
router.get('/:id', blogValidation.getBlogById, blogController.getBlogById);

/**
 * @route GET /api/blogs/slug/:slug
 * @desc Get blog by slug
 * @access Public
 * @param {string} slug - Blog slug
 */
router.get('/slug/:slug', blogController.getBlogBySlug);

/**
 * @route POST /api/blogs
 * @desc Create new blog
 * @access Private (Authenticated users)
 * @body {string} blog_title - Blog title (required, 5-200 chars)
 * @body {string} blog_content - Blog content (required, min 50 chars)
 * @body {string} blog_excerpt - Blog excerpt (required, 10-500 chars)
 * @body {object} blog_thumbnail - Blog thumbnail {url, alt}
 * @body {string} blog_category - Category ID (optional)
 * @body {array} blog_tags - Array of tags (optional)
 * @body {string} blog_status - Status (draft, published, archived)
 * @body {object} blog_meta - SEO meta data {title, description, keywords}
 * @body {boolean} blog_featured - Featured status (optional)
 */
router.post('/', 
    authMiddlewares.isAuthorized,
    blogValidation.createBlog,
    blogController.createBlog
);

/**
 * @route PUT /api/blogs/:id
 * @desc Update blog by ID
 * @access Private (Authenticated users - own blogs or admin)
 * @param {string} id - Blog ID
 * @body Same as POST but all fields optional
 */
router.put('/:id',
    authMiddlewares.isAuthorized,
    blogValidation.getBlogById,
    blogValidation.updateBlog,
    blogController.updateBlog
);

/**
 * @route DELETE /api/blogs/:id
 * @desc Delete blog by ID
 * @access Private (Admin only)
 * @param {string} id - Blog ID
 */
router.delete('/:id',
    authMiddlewares.isAuthorized,
    rbacMiddlewares.grantAccess('deleteAny', 'blog'),
    blogValidation.getBlogById,
    blogController.deleteBlog
);

export default router;
