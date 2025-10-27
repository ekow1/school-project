import express from 'express';
import {
    createFirePersonnel,
    getAllFirePersonnel,
    getFirePersonnelById,
    updateFirePersonnel,
    deleteFirePersonnel,
    getPersonnelBySubdivision,
    getPersonnelByDepartment,
    getPersonnelByStation
} from '../controllers/firePersonnelController.js';

const router = express.Router();

router.post('/', createFirePersonnel);
router.get('/', getAllFirePersonnel);
router.get('/station/:stationId', getPersonnelByStation);
router.get('/subdivision/:subdivisionId', getPersonnelBySubdivision);
router.get('/department/:departmentId', getPersonnelByDepartment);
router.get('/:id', getFirePersonnelById);
router.put('/:id', updateFirePersonnel);
router.delete('/:id', deleteFirePersonnel);

export default router;

