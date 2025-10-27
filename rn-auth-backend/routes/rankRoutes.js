import express from 'express';
import {
    createRank,
    getAllRanks,
    getRankById,
    updateRank,
    deleteRank
} from '../controllers/rankController.js';

const router = express.Router();

router.post('/', createRank);
router.get('/', getAllRanks);
router.get('/:id', getRankById);
router.patch('/:id', updateRank);
router.delete('/:id', deleteRank);

export default router;


