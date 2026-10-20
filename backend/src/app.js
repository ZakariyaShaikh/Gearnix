import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import healthRoutes from "./routes/health.routes.js"
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import categoryRoutes from './routes/category.route.js';
import productRoutes from './routes/product.route.js';
import roleManagementRoutes from './routes/role-management.route.js';
import blogRoutes from './routes/blog.route.js';



const app = express();

app.use(helmet());
app.use(cors());


app.use(express.json({ limit: '1mb' }));
const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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


export default app ;