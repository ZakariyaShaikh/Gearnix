import {
    createBlogService,
    updateBlogService,
    listBlogsService,
    getPublishedBlogService,
    getBlogByIdService,
    updateBlogCoverService,
    removeBlogCoverService
} from '../services/blog.service.js';

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : 'Internal server error'
    });
};

// Public: published posts only
export const listPublicBlogs = async (req, res) => {
    try {
        const result = await listBlogsService({ includeDrafts: false, ...req.listQuery });

        return res.status(200).json({ success: true, message: 'Blogs fetched successfully', data: result });
    } catch (error) {
        return sendError(res, error);
    }
};

// Admin: drafts included
export const listAdminBlogs = async (req, res) => {
    try {
        const result = await listBlogsService({ includeDrafts: true, ...req.listQuery });

        return res.status(200).json({ success: true, message: 'Blogs fetched successfully', data: result });
    } catch (error) {
        return sendError(res, error);
    }
};

export const getPublicBlog = async (req, res) => {
    try {
        const blog = await getPublishedBlogService(req.params.slug);

        return res.status(200).json({ success: true, message: 'Blog fetched successfully', data: blog });
    } catch (error) {
        return sendError(res, error);
    }
};

export const getAdminBlog = async (req, res) => {
    try {
        const blog = await getBlogByIdService(req.params.id);

        return res.status(200).json({ success: true, message: 'Blog fetched successfully', data: blog });
    } catch (error) {
        return sendError(res, error);
    }
};

export const createBlog = async (req, res) => {
    try {
        // The author comes from the verified token, never the body
        const blog = await createBlogService(req.user.user_id, req.body);

        return res.status(201).json({ success: true, message: 'Blog created successfully', data: blog });
    } catch (error) {
        return sendError(res, error);
    }
};

export const updateBlog = async (req, res) => {
    try {
        const blog = await updateBlogService(req.params.id, req.body);

        return res.status(200).json({ success: true, message: 'Blog updated successfully', data: blog });
    } catch (error) {
        return sendError(res, error);
    }
};

export const updateBlogCover = async (req, res) => {
    try {
        // req.file was filled by uploadBlogCover
        const blog = await updateBlogCoverService(req.params.id, req.file.filename);

        return res.status(200).json({
            success: true,
            message: 'Blog cover updated successfully',
            data: blog
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const removeBlogCover = async (req, res) => {
    try {
        const blog = await removeBlogCoverService(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Blog cover removed successfully',
            data: blog
        });
    } catch (error) {
        return sendError(res, error);
    }
};