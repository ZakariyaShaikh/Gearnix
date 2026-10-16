import {
    getUserProfile,
    updateUserProfile,
    getUserPasswordHash,
    updateUserPassword,
    updateUserProfileImage,
    getAccountDeletionInfo,
    softDeleteUser,
    listUsers,
    changeUserRole
} from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.utils.js';
import {
    PROFILE_IMAGE_URL_PREFIX,
    deleteProfileImageFile
} from '../utils/file.utils.js';

export const getProfileService = async (userId) => {
    const profile = await getUserProfile(userId);

    if (!profile) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return profile;
};

export const updateProfileService = async (userId, { username }) => {
    let updated;

    try {
        updated = await updateUserProfile(userId, username);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('Username is already taken');
            error.statusCode = 409;
            throw error;
        }
        throw err;
    }

    if (!updated) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    return updated;
};

export const changePasswordService = async (userId, { current_password, new_password }) => {
    const user = await getUserPasswordHash(userId);

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isMatch = await comparePassword(current_password, user.password_hash);

    if (!isMatch) {
        const error = new Error('Current password is incorrect');
        error.statusCode = 400;
        throw error;
    }

    const isSamePassword = await comparePassword(new_password, user.password_hash);

    if (isSamePassword) {
        const error = new Error('New password must be different from the current password');
        error.statusCode = 400;
        throw error;
    }

    const newHash = await hashPassword(new_password);
    const updated = await updateUserPassword(userId, newHash);

    if (!updated) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
};

export const updateProfileImageService = async (userId, filename) => {
    const newPath = `${PROFILE_IMAGE_URL_PREFIX}${filename}`;

    try {
        const current = await getUserProfile(userId);

        if (!current) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const oldImage = current.profile_image;

        const updated = await updateUserProfileImage(userId, newPath);

        if (!updated) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // DB now points to the new file, so the old one can go
        if (oldImage && oldImage.startsWith(PROFILE_IMAGE_URL_PREFIX)) {
            await deleteProfileImageFile(oldImage);
        }

        return updated;
    } catch (err) {
        // Anything failed: don't leave the new upload orphaned on disk
        await deleteProfileImageFile(newPath);
        throw err;
    }
};

export const deleteAccountService = async (userId, password) => {
    const info = await getAccountDeletionInfo(userId);

    if (!info) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isMatch = await comparePassword(password, info.password_hash);

    if (!isMatch) {
        const error = new Error('Password is incorrect');
        error.statusCode = 400;
        throw error;
    }

    // Safety guard: never remove the last active holder of a system role
    if (Number(info.is_system_role) === 1 && Number(info.other_active_holders) === 0) {
        const error = new Error(
            'You are the last active user with this role, so this account cannot be deleted'
        );
        error.statusCode = 403;
        throw error;
    }

    const deleted = await softDeleteUser(userId);

    if (!deleted) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
};

export const listUsersService = async ({ roleId, search, page, limit }) => {
    const offset = (page - 1) * limit;

    const { total, items } = await listUsers({
        roleId,
        search,
        limit,
        offset
    });

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    };
};

// Maps the procedure's SIGNAL messages to HTTP responses
const ROLE_CHANGE_ERRORS = {
    SELF_ROLE_CHANGE: { statusCode: 403, message: 'You cannot change your own role' },
    USER_NOT_FOUND: { statusCode: 404, message: 'User not found' },
    ROLE_NOT_FOUND: { statusCode: 400, message: 'Role does not exist' },
    ROLE_INACTIVE: { statusCode: 400, message: 'This role is inactive and cannot be assigned' },
    SAME_ROLE: { statusCode: 409, message: 'User already has this role' },
    LAST_ROLE_MANAGER: {
        statusCode: 409,
        message: 'Cannot remove the last user who can manage roles'
    }
};

export const changeUserRoleService = async (targetUserId, changedBy, { role_id, reason }) => {
    try {
        const user = await changeUserRole({
            targetUserId,
            newRoleId: role_id,
            changedBy,
            reason
        });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        return user;
    } catch (err) {
        // The procedure's error text is in sqlMessage, for example "LAST_ROLE_MANAGER"
        const known = Object.keys(ROLE_CHANGE_ERRORS).find((key) =>
            err.sqlMessage?.includes(key)
        );

        if (known) {
            const error = new Error(ROLE_CHANGE_ERRORS[known].message);
            error.statusCode = ROLE_CHANGE_ERRORS[known].statusCode;
            throw error;
        }

        throw err;
    }
};