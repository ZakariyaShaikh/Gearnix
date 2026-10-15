import multer from 'multer';
import { PROFILE_IMAGE_DIR, PRODUCT_IMAGE_DIR } from '../utils/file.utils.js';

const ALLOWED_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_PRODUCT_IMAGES = 5;

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_TYPES[file.mimetype]) {
        const error = new Error('Only JPEG, PNG and WEBP images are allowed');
        error.isValidation = true;
        return cb(error);
    }
    cb(null, true);
};

// ---------- Profile image (single file, field "profile_image") ----------

const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PROFILE_IMAGE_DIR);
    },
    filename: (req, file, cb) => {
        const ext = ALLOWED_TYPES[file.mimetype];
        cb(null, `user-${req.user.user_id}-${Date.now()}${ext}`);
    }
});

const profileUpload = multer({
    storage: profileStorage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

export const uploadProfileImage = (req, res, next) => {
    profileUpload.single('profile_image')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError || err.isValidation) {
                const message =
                    err.code === 'LIMIT_FILE_SIZE'
                        ? 'Image must be 2MB or smaller'
                        : err.code === 'LIMIT_UNEXPECTED_FILE'
                        ? 'Upload the image using the field name "profile_image"'
                        : err.message;

                return res.status(400).json({ success: false, message });
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Profile image file is required'
            });
        }

        next();
    });
};

// ---------- Product images (up to 5 files, field "images") ----------

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PRODUCT_IMAGE_DIR);
    },
    filename: (req, file, cb) => {
        // req.params.id is already validated as a positive integer
        // by validateProductIdParam, which runs before this middleware
        const ext = ALLOWED_TYPES[file.mimetype];
        const unique = Math.random().toString(36).slice(2, 8);
        cb(null, `product-${req.params.id}-${Date.now()}-${unique}${ext}`);
    }
});

const productUpload = multer({
    storage: productStorage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_PRODUCT_IMAGES
    }
});

export const uploadProductImages = (req, res, next) => {
    productUpload.array('images', MAX_PRODUCT_IMAGES)(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError || err.isValidation) {
                const message =
                    err.code === 'LIMIT_FILE_SIZE'
                        ? 'Each image must be 2MB or smaller'
                        : err.code === 'LIMIT_FILE_COUNT'
                        ? `You can upload at most ${MAX_PRODUCT_IMAGES} images at once`
                        : err.code === 'LIMIT_UNEXPECTED_FILE'
                        ? 'Upload the images using the field name "images"'
                        : err.message;

                return res.status(400).json({ success: false, message });
            }

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one image file is required'
            });
        }

        next();
    });
};