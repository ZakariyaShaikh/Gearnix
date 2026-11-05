import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { uploadBlogCover } from '../middlewares/upload.middleware.js';
import {
    listPublicBlogs,
    listAdminBlogs,
    getPublicBlog,
    getAdminBlog,
    createBlog,
    updateBlog,
    updateBlogCover,
    removeBlogCover,
    deleteBlog
} from '../controllers/blog.controller.js';
import {
    validateBlogIdParam,
    validateBlogSlugParam,
    validateBlogListQuery,
    validateCreateBlog,
    validateUpdateBlog
} from '../validators/blog.validator.js';

const router = express.Router();

// Public list
router.get('/', validateBlogListQuery, listPublicBlogs);

// Admin routes come BEFORE '/:slug', or "admin" would be read as a slug
router.get(
    '/admin',
    authenticate,
    requirePermission('blog.read'),
    validateBlogListQuery,
    listAdminBlogs
);

router.get(
    '/admin/:id',
    authenticate,
    requirePermission('blog.read'),
    validateBlogIdParam,
    getAdminBlog
);

// Public detail by slug (published only)
router.get('/:slug', validateBlogSlugParam, getPublicBlog);

router.post(
    '/',
    authenticate,
    requirePermission('blog.create'),
    validateCreateBlog,
    createBlog
);

router.patch(
    '/:id',
    authenticate,
    requirePermission('blog.update'),
    validateBlogIdParam,
    validateUpdateBlog,
    updateBlog
);

// Upload or replace the cover image
router.post(
    '/:id/cover',
    authenticate,
    requirePermission('blog.update'),
    validateBlogIdParam,
    uploadBlogCover,
    updateBlogCover
);

// Remove the cover image
router.delete(
    '/:id/cover',
    authenticate,
    requirePermission('blog.update'),
    validateBlogIdParam,
    removeBlogCover
);

// Delete the blog post
router.delete(
    '/:id',
    authenticate,
    requirePermission('blog.delete'),
    validateBlogIdParam,
    deleteBlog
);

export default router;