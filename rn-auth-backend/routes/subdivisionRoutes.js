import express from 'express';
import {
    createSubdivision,
    getAllSubdivisions,
    getSubdivisionById,
    updateSubdivision,
    deleteSubdivision,
    getSubdivisionsByDepartment
} from '../controllers/subdivisionController.js';

const router = express.Router();

router.post('/', createSubdivision);
router.get('/', getAllSubdivisions);
router.get('/:id', getSubdivisionById);
router.patch('/:id', updateSubdivision);
router.delete('/:id', deleteSubdivision);
router.get('/department/:departmentId', getSubdivisionsByDepartment);

export default router;


