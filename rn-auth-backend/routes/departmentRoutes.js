import express from 'express';
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Departments
 *     description: Universal department management. Departments are shared across all stations. Supports CRUD operations.
 */

/**
 * @swagger
 * /api/fire/departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     description: Create a new universal department (shared across all stations)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepartmentCreateRequest'
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentResponse'
 *       400:
 *         description: Validation error or duplicate department name
 *       500:
 *         description: Server error
 */
router.post('/', createDepartment);

/**
 * @swagger
 * /api/fire/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     description: Retrieve all universal departments
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *       500:
 *         description: Server error
 */
router.get('/', getAllDepartments);

/**
 * @swagger
 * /api/fire/departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     description: Retrieve a specific department by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Department'
 *       400:
 *         description: Invalid department ID format
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getDepartmentById);

/**
 * @swagger
 * /api/fire/departments/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
 *     description: Update an existing department
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentResponse'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.put('/:id', updateDepartment);

/**
 * @swagger
 * /api/fire/departments/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
 *     description: Delete a department by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
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
 *         description: Invalid department ID format
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteDepartment);

export default router;


