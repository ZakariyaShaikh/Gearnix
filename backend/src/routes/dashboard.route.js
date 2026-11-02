import express from 'express'
import { getDashboardAnalytics } from '../controllers/dashboard.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { requirePermission } from '../middlewares/permission.middleware.js'

const router = express.Router()

router.get('/analytics', authenticate, requirePermission('user.read'), getDashboardAnalytics)

export default router
