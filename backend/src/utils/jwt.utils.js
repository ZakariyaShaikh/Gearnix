import jwt from 'jsonwebtoken';

export const generateAccessToken = ({
    userId,
    roleId,
    roleName
}) => {

    return jwt.sign(
        {
            user_id: userId,
            role_id: roleId,
            role_name: roleName
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        }
    );
};