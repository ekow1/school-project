import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
    createSuperAdmin,
    loginSuperAdmin,
    getAllSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin,
    changePassword,
    addManagedDepartment,
    removeManagedDepartment
} from '../controllers/superAdminController.js';

const router = express.Router();

// Public routes (no authentication needed)
router.post('/register', createSuperAdmin);
router.post('/login', loginSuperAdmin);

// Protected routes (require authentication)
router.get('/', verifyToken, getAllSuperAdmins);
router.get('/:id', verifyToken, getSuperAdminById);
router.patch('/:id', verifyToken, updateSuperAdmin);
router.delete('/:id', verifyToken, deleteSuperAdmin);
router.post('/:id/change-password', verifyToken, changePassword);
router.post('/:id/departments/add', verifyToken, addManagedDepartment);
router.post('/:id/departments/remove', verifyToken, removeManagedDepartment);

export default router;

