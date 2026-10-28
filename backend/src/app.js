import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import healthRoutes from "./routes/health.routes.js"
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';
import roleManagementRoutes from './routes/role-management.route.js';
import blogRoutes from './routes/blog.route.js';
import cartRoutes from './routes/cart.route.js';
import wishlistRoutes from './routes/wishlist.route.js';
import addressRoutes from './routes/address.route.js';
import orderRoutes from './routes/order.route.js';
import webhookRoutes from './routes/webhook.route.js';




const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use('/api/webhooks', webhookRoutes);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser())
const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use(
    '/uploads',
    (req, res, next) => {
        if (
            req.path.startsWith('/blog-images/') ||
            req.path.startsWith('/product-images/')
        ) {
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        }
        next();
    },
    express.static(path.join(__dirname, '..', 'uploads'))
);

app.get("/api/health" , (req, res) => {
    res.status(200).json({
        success : true , 
        message : "Gearnix backend is running"
    });
});

app.use("/api/health" , healthRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/roles', roleManagementRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);

export default app ;