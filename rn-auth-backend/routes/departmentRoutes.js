import express from 'express';
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    getDepartmentsByStation
} from '../controllers/departmentController.js';

const router = express.Router();

router.post('/', createDepartment);
router.get('/', getAllDepartments);
router.get('/station/:stationId', getDepartmentsByStation);
router.get('/:id', getDepartmentById);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;


