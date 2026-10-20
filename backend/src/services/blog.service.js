import {
    createBlog,
    updateBlog,
    listBlogs,
    getBlogBySlug,
    getBlogById
} from '../models/blog.model.js';
import { slugify } from '../utils/slug.utils.js';
import { BLOG_IMAGE_URL_PREFIX, deleteBlogImageFile } from '../utils/file.utils.js';

const notFound = () => {
    const error = new Error('Blog not found');
    error.statusCode = 404;
    return error;
};

export const createBlogService = async (userId, input) => {
    // Use the explicit slug if sent, otherwise build one from the title
    const slug = input.slug ?? slugify(input.title);

    if (!slug) {
        const error = new Error('Title must contain letters or numbers');
        error.statusCode = 400;
        throw error;
    }

    try {
        return await createBlog({
            title: input.title,
            slug,
            excerpt: input.excerpt,
            content: input.content,
            coverImage: input.cover_image,
            isPublished: input.is_published,
            createdBy: userId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('A blog with this slug already exists');
            error.statusCode = 409;
            throw error;
        }
        throw err;
    }
};

export const updateBlogService = async (blogId, input) => {
    try {
        const blog = await updateBlog({
            blogId,
            title: input.title,
            // Only changed when sent explicitly: renaming a post keeps its URL
            slug: input.slug,
            excerpt: input.excerpt,
            excerptProvided: input.excerpt_provided,
            content: input.content,
            coverImage: input.cover_image,
            coverProvided: input.cover_provided,
            isPublished:
                input.is_published === undefined ? undefined : input.is_published ? 1 : 0
        });

        if (!blog) {
            throw notFound();
        }

        return blog;
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('A blog with this slug already exists');
            error.statusCode = 409;
            throw error;
        }
        throw err;
    }
};

export const listBlogsService = async ({ includeDrafts, search, page, limit }) => {
    const offset = (page - 1) * limit;

    const { total, items } = await listBlogs({ includeDrafts, search, limit, offset });

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    };
};

export const getPublishedBlogService = async (slug) => {
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        throw notFound();
    }

    return blog;
};

export const getBlogByIdService = async (blogId) => {
    const blog = await getBlogById(blogId);

    if (!blog) {
        throw notFound();
    }

    return blog;
};

export const updateBlogCoverService = async (blogId, filename) => {
    const newPath = `${BLOG_IMAGE_URL_PREFIX}${filename}`;

    try {
        const current = await getBlogById(blogId);

        if (!current) {
            throw notFound();
        }

        const oldPath = current.cover_image;

        const updated = await updateBlog({
            blogId,
            coverImage: newPath,
            coverProvided: true
        });

        if (!updated) {
            throw notFound();
        }

        // The database now points to the new file, so the old one can go
        if (oldPath && oldPath.startsWith(BLOG_IMAGE_URL_PREFIX)) {
            await deleteBlogImageFile(oldPath);
        }

        return updated;
    } catch (err) {
        // The request failed: the new file would be orphaned, so remove it
        await deleteBlogImageFile(newPath);
        throw err;
    }
};

export const removeBlogCoverService = async (blogId) => {
    const current = await getBlogById(blogId);

    if (!current) {
        throw notFound();
    }

    const updated = await updateBlog({
        blogId,
        coverImage: null,
        coverProvided: true
    });

    if (!updated) {
        throw notFound();
    }

    if (current.cover_image && current.cover_image.startsWith(BLOG_IMAGE_URL_PREFIX)) {
        await deleteBlogImageFile(current.cover_image);
    }

    return updated;
};