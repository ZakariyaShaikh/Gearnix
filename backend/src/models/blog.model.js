import pool from '../config/db.js';

export const createBlog = async ({ title, slug, excerpt, content, coverImage, isPublished, createdBy }) => {
    const [rows] = await pool.query('CALL sp_create_blog(?, ?, ?, ?, ?, ?, ?)', [
        title,
        slug,
        excerpt ?? null,
        content,
        coverImage ?? null,
        isPublished ? 1 : 0,
        createdBy
    ]);

    return rows[0][0];
};

export const updateBlog = async ({
    blogId,
    title,
    slug,
    excerpt,
    excerptProvided,
    content,
    coverImage,
    coverProvided,
    isPublished
}) => {
    const [rows] = await pool.query('CALL sp_update_blog(?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        blogId,
        title ?? null,
        slug ?? null,
        excerpt ?? null,
        excerptProvided ? 1 : 0,
        content ?? null,
        coverImage ?? null,
        coverProvided ? 1 : 0,
        isPublished ?? null
    ]);

    // No row means the blog ID doesn't exist
    return rows[0][0] || null;
};

export const listBlogs = async ({ includeDrafts, search, limit, offset }) => {
    const [rows] = await pool.query('CALL sp_list_blogs(?, ?, ?, ?)', [
        includeDrafts ? 1 : 0,
        search ?? null,
        limit,
        offset
    ]);

    // rows[0] = the count, rows[1] = the page of posts
    return {
        total: Number(rows[0][0].total),
        items: rows[1]
    };
};

export const getBlogBySlug = async (slug) => {
    const [rows] = await pool.query('CALL sp_get_blog_by_slug(?)', [slug]);

    return rows[0][0] || null;
};

export const getBlogById = async (blogId) => {
    const [rows] = await pool.query('CALL sp_get_blog_by_id(?)', [blogId]);

    return rows[0][0] || null;
};
export const deleteBlog = async (blogId) => {
    const [rows] = await pool.query('CALL sp_delete_blog(?)', [blogId]);

    // rows[0] = the deleted cover image URL
    return rows[0][0] || null;
};