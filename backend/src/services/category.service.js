import { createCategory, getCategories , updateCategory} from '../models/category.model.js';
import { slugify } from '../utils/slug.utils.js';

export const createCategoryService = async ({ name, description }) => {
    const slug = slugify(name);

    if (!slug) {
        const error = new Error('Category name must contain letters or numbers');
        error.statusCode = 400;
        throw error;
    }

    try {
        return await createCategory(name, slug, description);
    } catch (err) {
        // UNIQUE index on name or slug was violated
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('A category with this name already exists');
            error.statusCode = 409;
            throw error;
        }
        throw err;
    }
};

export const getCategoriesService = async ({ includeInactive = false } = {}) => {
    return getCategories(includeInactive);
};

export const updateCategoryService = async (categoryId, input) => {
    // A new name means a new slug
    let slug;

    if (input.name !== undefined) {
        slug = slugify(input.name);

        if (!slug) {
            const error = new Error('Category name must contain letters or numbers');
            error.statusCode = 400;
            throw error;
        }
    }

    try {
        const category = await updateCategory({
            categoryId,
            name: input.name,
            slug,
            description: input.description,
            descriptionProvided: input.description_provided,
            // Convert true/false to the 1/0 the procedure expects
            isActive: input.is_active === undefined ? undefined : input.is_active ? 1 : 0
        });

        if (!category) {
            const error = new Error('Category not found');
            error.statusCode = 404;
            throw error;
        }

        return category;
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('A category with this name already exists');
            error.statusCode = 409;
            throw error;
        }

        throw err;
    }
};