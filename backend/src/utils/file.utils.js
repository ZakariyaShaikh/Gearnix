import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// src/utils -> src -> backend, then /uploads
export const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads');
export const PROFILE_IMAGE_DIR = path.join(UPLOADS_ROOT, 'profile-images');
export const PRODUCT_IMAGE_DIR = path.join(UPLOADS_ROOT, 'product-images');

// Public URL prefixes stored in the database
export const PROFILE_IMAGE_URL_PREFIX = '/uploads/profile-images/';
export const PRODUCT_IMAGE_URL_PREFIX = '/uploads/product-images/';

// Make sure both folders exist when the server starts
fs.mkdirSync(PROFILE_IMAGE_DIR, { recursive: true });
fs.mkdirSync(PRODUCT_IMAGE_DIR, { recursive: true });

// Shared delete logic. Never throws.
const deleteFromFolder = async (folder, storedPathOrName) => {
    if (!storedPathOrName) return;

    // path.basename strips folder parts, so only files inside `folder` can be touched
    const fileName = path.basename(storedPathOrName);

    try {
        await fs.promises.unlink(path.join(folder, fileName));
    } catch (err) {
        // File already gone: not worth failing the request
    }
};

export const deleteProfileImageFile = (storedPathOrName) =>
    deleteFromFolder(PROFILE_IMAGE_DIR, storedPathOrName);

export const deleteProductImageFile = (storedPathOrName) =>
    deleteFromFolder(PRODUCT_IMAGE_DIR, storedPathOrName);