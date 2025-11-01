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

/**
 * @swagger
 * tags:
 *   - name: Departments
 *     description: Department management linked to fire stations. Supports CRUD operations and station-based filtering.
 */

/**
 * @swagger
 * /api/fire/departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     description: Create a new department linked to a fire station
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
 *         description: Validation error
 *       404:
 *         description: Station not found
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
 *     description: Retrieve all departments with optional station filtering
 *     parameters:
 *       - in: query
 *         name: station_id
 *         schema:
 *           type: string
 *         description: Filter by station ID
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
 * /api/fire/departments/station/{stationId}:
 *   get:
 *     summary: Get departments by station
 *     tags: [Departments]
 *     description: Retrieve all departments for a specific station
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Station ID
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
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 *       400:
 *         description: Invalid station ID format
 *       500:
 *         description: Server error
 */
router.get('/station/:stationId', getDepartmentsByStation);

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
 *               station_id:
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


