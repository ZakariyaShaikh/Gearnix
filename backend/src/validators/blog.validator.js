const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COVER_PREFIX = '/uploads/blog-images/';

const hasField = (body, field) => Object.prototype.hasOwnProperty.call(body, field);

// Checks the blog fields. partial = true means missing fields are simply left alone
const cleanBlogFields = (body, { partial }) => {
    const cleaned = {
        title: undefined,
        slug: undefined,
        excerpt: undefined,
        excerpt_provided: false,
        content: undefined,
        cover_image: undefined,
        cover_provided: false,
        is_published: undefined
    };

    // title
    if (!partial || hasField(body, 'title')) {
        if (body.title === undefined) return { error: 'Title is required' };
        if (typeof body.title !== 'string') return { error: 'Title must be text' };

        const title = body.title.trim();

        if (title.length < 3 || title.length > 200) {
            return { error: 'Title must be between 3 and 200 characters' };
        }

        cleaned.title = title;
    }

    // slug (optional; if sent, must be a clean slug)
    if (hasField(body, 'slug')) {
        if (typeof body.slug !== 'string' || body.slug.length > 220 || !SLUG_PATTERN.test(body.slug)) {
            return { error: 'Slug must use lowercase letters, numbers and single hyphens' };
        }

        cleaned.slug = body.slug;
    }

    // excerpt (optional, null clears it)
    if (hasField(body, 'excerpt')) {
        cleaned.excerpt_provided = true;

        if (body.excerpt !== null) {
            if (typeof body.excerpt !== 'string') return { error: 'Excerpt must be text' };

            const excerpt = body.excerpt.trim();

            if (excerpt.length > 500) return { error: 'Excerpt must be 500 characters or fewer' };

            cleaned.excerpt = excerpt || null;
        }
    }

    // content
    if (!partial || hasField(body, 'content')) {
        if (body.content === undefined) return { error: 'Content is required' };
        if (typeof body.content !== 'string' || body.content.trim().length === 0) {
            return { error: 'Content must be text and cannot be empty' };
        }
        if (body.content.length > 100000) {
            return { error: 'Content must be 100,000 characters or fewer' };
        }

        cleaned.content = body.content;
    }

    // cover_image (optional, null clears it; must be inside our upload folder)
    if (hasField(body, 'cover_image')) {
        cleaned.cover_provided = true;

        if (body.cover_image !== null) {
            if (
                typeof body.cover_image !== 'string' ||
                !body.cover_image.startsWith(COVER_PREFIX) ||
                body.cover_image.length > 500
            ) {
                return { error: `Cover image must be a path starting with ${COVER_PREFIX}` };
            }

            cleaned.cover_image = body.cover_image;
        }
    }

    // is_published (optional, must be true or false)
    if (hasField(body, 'is_published')) {
        if (typeof body.is_published !== 'boolean') {
            return { error: 'is_published must be true or false' };
        }

        cleaned.is_published = body.is_published;
    }

    return { cleaned };
};

export const validateBlogIdParam = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    req.params.id = id;
    next();
};

export const validateBlogSlugParam = (req, res, next) => {
    if (!SLUG_PATTERN.test(req.params.slug) || req.params.slug.length > 220) {
        return res.status(400).json({ success: false, message: 'Invalid blog slug' });
    }

    next();
};

export const validateCreateBlog = (req, res, next) => {
    const result = cleanBlogFields(req.body || {}, { partial: false });

    if (result.error) {
        return res.status(400).json({ success: false, message: result.error });
    }

    req.body = result.cleaned;
    next();
};

export const validateUpdateBlog = (req, res, next) => {
    const body = req.body || {};
    const fields = ['title', 'slug', 'excerpt', 'content', 'cover_image', 'is_published'];

    if (!fields.some((field) => hasField(body, field))) {
        return res.status(400).json({
            success: false,
            message: 'Send at least one field to update'
        });
    }

    const result = cleanBlogFields(body, { partial: true });

    if (result.error) {
        return res.status(400).json({ success: false, message: result.error });
    }

    req.body = result.cleaned;
    next();
};

export const validateBlogListQuery = (req, res, next) => {
    const query = req.query || {};

    const page = query.page === undefined ? 1 : Number(query.page);

    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({ success: false, message: 'Page must be a whole number, 1 or more' });
    }

    const limit = query.limit === undefined ? 12 : Number(query.limit);

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        return res.status(400).json({
            success: false,
            message: 'Limit must be a whole number between 1 and 50'
        });
    }

    let search = null;

    if (query.search !== undefined) {
        if (typeof query.search !== 'string') {
            return res.status(400).json({ success: false, message: 'Search must be text' });
        }

        const trimmed = query.search.trim();

        if (trimmed.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Search must be 100 characters or fewer'
            });
        }

        search = trimmed || null;
    }

    req.listQuery = { page, limit, search };
    next();
};