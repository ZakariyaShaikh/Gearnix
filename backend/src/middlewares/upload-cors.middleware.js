const CROSS_ORIGIN_IMAGE_PATHS = [
    '/blog-images/',
    '/product-images/',
    '/profile-images/'
];

export const allowCrossOriginUploads = (req, res, next) => {
    if (CROSS_ORIGIN_IMAGE_PATHS.some((prefix) => req.path.startsWith(prefix))) {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
    next();
};
