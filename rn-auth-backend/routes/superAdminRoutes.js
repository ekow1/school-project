import express from 'express';
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
router.get('/', getAllSuperAdmins);
router.get('/:id', getSuperAdminById);
router.patch('/:id', updateSuperAdmin);
router.delete('/:id', deleteSuperAdmin);
router.post('/:id/change-password', changePassword);
router.post('/:id/departments/add', addManagedDepartment);
router.post('/:id/departments/remove', removeManagedDepartment);

export default router;

