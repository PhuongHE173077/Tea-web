import express from 'express';
import { blogController } from '~/controllers/blog.controller';
import { authMiddlewares } from '~/middlewares/authMiddlewares';
import { rbacMiddlewares } from '~/middlewares/rbacMiddlewares';
import { blogValidation } from '~/validations/blog.validation';

const router = express.Router();

// Public routes - không cần authentication
router.route('/')
    .get(blogValidation.getBlogs, blogController.getAllBlogs);

router.route('/:id')
    .get(blogValidation.getBlogById, blogController.getBlogById);

router.route('/slug/:slug')
    .get(blogController.getBlogBySlug);

// Protected routes - cần authentication
router.route('/')
    .post(
        authMiddlewares.isAuthorized,
        blogValidation.createBlog,
        blogController.createBlog
    );

router.route('/:id')
    .put(
        authMiddlewares.isAuthorized,
        blogValidation.getBlogById,
        blogValidation.updateBlog,
        blogController.updateBlog
    )
    .delete(
        authMiddlewares.isAuthorized,
        rbacMiddlewares.grantAccess('deleteAny', 'blog'),
        blogValidation.getBlogById,
        blogController.deleteBlog
    );

export const blogRoutes = router;
