import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permission.middleware.js";
import { uploadProfileImage } from "../middlewares/upload.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
  deleteAccount,
  listUsers,
  changeUserRole,
} from "../controllers/user.controller.js";
import {
  validateUpdateProfile,
  validateChangePassword,
  validateDeleteAccount,
  validateUserListQuery,
  validateUserIdParam,
  validateChangeUserRole,
} from "../validators/user.validator.js";

const router = express.Router();

// Admin: list users (user.read)
router.get(
  "/",
  authenticate,
  requirePermission("user.read"),
  validateUserListQuery,
  listUsers,
);

// Admin: change a user's role (user.update_role)
router.patch(
  "/:id/role",
  authenticate,
  requirePermission("user.update_role"),
  validateUserIdParam,
  validateChangeUserRole,
  changeUserRole,
);

// Own account
router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, validateUpdateProfile, updateProfile);
router.patch(
  "/change-password",
  authenticate,
  validateChangePassword,
  changePassword,
);
router.patch(
  "/profile-image",
  authenticate,
  uploadProfileImage,
  updateProfileImage,
);
router.delete("/account", authenticate, validateDeleteAccount, deleteAccount);

export default router;
