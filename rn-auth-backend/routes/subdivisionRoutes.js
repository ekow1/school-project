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

/**
 * @swagger
 * tags:
 *   - name: Subdivisions
 *     description: Unit management within departments. Supports CRUD operations and department-based filtering.
 */

/**
 * @swagger
 * /api/fire/subdivisions:
 *   post:
 *     summary: Create a new unit
 *     tags: [Subdivisions]
 *     description: Create a new unit within a department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubdivisionCreateRequest'
 *     responses:
 *       201:
 *         description: Unit created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubdivisionResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.post('/', createSubdivision);

/**
 * @swagger
 * /api/fire/subdivisions:
 *   get:
 *     summary: Get all units
 *     tags: [Subdivisions]
 *     description: Retrieve all units with optional department filtering
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *     responses:
 *       200:
 *         description: List of units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subdivision'
 *       500:
 *         description: Server error
 */
router.get('/', getAllSubdivisions);

/**
 * @swagger
 * /api/fire/subdivisions/{id}:
 *   get:
 *     summary: Get unit by ID
 *     tags: [Subdivisions]
 *     description: Retrieve a specific unit by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unit ID
 *     responses:
 *       200:
 *         description: Unit details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Subdivision'
 *       400:
 *         description: Invalid unit ID format
 *       404:
 *         description: Unit not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getSubdivisionById);

/**
 * @swagger
 * /api/fire/subdivisions/{id}:
 *   patch:
 *     summary: Update unit
 *     tags: [Subdivisions]
 *     description: Update an existing unit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *               groupNames:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubdivisionResponse'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Unit not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateSubdivision);

/**
 * @swagger
 * /api/fire/subdivisions/{id}:
 *   delete:
 *     summary: Delete unit
 *     tags: [Subdivisions]
 *     description: Delete a unit by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unit ID
 *     responses:
 *       200:
 *         description: Unit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid unit ID format
 *       404:
 *         description: Unit not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteSubdivision);

/**
 * @swagger
 * /api/fire/subdivisions/department/{departmentId}:
 *   get:
 *     summary: Get units by department
 *     tags: [Subdivisions]
 *     description: Retrieve all units for a specific department
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: List of units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subdivision'
 *       400:
 *         description: Invalid department ID format
 *       500:
 *         description: Server error
 */
router.get('/department/:departmentId', getSubdivisionsByDepartment);

export default router;


