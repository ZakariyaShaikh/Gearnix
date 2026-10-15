import jwt from 'jsonwebtoken';
import { getUserAuthState } from '../models/user.model.js'; // NEW

export const authenticate = async (req, res, next) => { // NEW: async
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is required'
            });
        }

        const [scheme, token] = authHeader.split(' ');

        if (
            scheme !== 'Bearer' ||
            !token
        ) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token format'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ---- NEW: re-check the user in the database ----
        const authUser = await getUserAuthState(decoded.user_id);

        if (!authUser || authUser.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Account is no longer active'
            });
        }

        // Keep everything the old code had (iat, exp, ...) but override
        // user_id / role_id / role_name with the CURRENT database values
        req.user = {
            ...decoded,
            user_id: authUser.user_id,
            role_id: authUser.role_id,
            role_name: authUser.role_name
        };
        // ---- END NEW ----

        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Authentication token has expired'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid authentication token'
            });
        }

        next(error);

    }

};