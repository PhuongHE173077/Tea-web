import express from 'express';
import { blogController } from '~/controllers/blog.controller';
import { authMiddlewares } from '~/middlewares/authMiddlewares';
import { adminMiddlewares } from '~/middlewares/adminMiddlewares';
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
        // Tạm dùng kiểm tra admin đơn giản để tránh lỗi RBAC do cấu hình grants chưa đầy đủ.
        // Khi đã seed roles/resources đầy đủ, có thể bật lại dòng dưới:
        // rbacMiddlewares.grantAccess('deleteAny', 'blog'),
        adminMiddlewares.isAdminSimple,
        blogValidation.getBlogById,
        blogController.deleteBlog
    );

export const blogRoutes = router;
