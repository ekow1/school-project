import express from 'express';
import { createSession, addMessage, getSessions, getSessionById } from '../controllers/chatController.js';

const router = express.Router();

/**
 * @swagger
 * /chat:
 *   post:
 *     summary: Create new chat session with first message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: How can I prevent kitchen fires?
 *     responses:
 *       201:
 *         description: Session created
 *       400:
 *         description: Bad request
 */
router.post('/chat', createSession);

/**
 * @swagger
 * /chat/{sessionId}/message:
 *   post:
 *     summary: Add user message to session and get AI response
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: What should I do during a fire evacuation?
 *     responses:
 *       200:
 *         description: Message added and AI response returned
 *       400:
 *         description: Bad request
 *       404:
 *         description: Session not found
 */
router.post('/chat/:sessionId/message', addMessage);

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Get all recent chat sessions
 *     responses:
 *       200:
 *         description: List of sessions
 */
router.get('/chat', getSessions);

/**
 * @swagger
 * /chat/{sessionId}:
 *   get:
 *     summary: Get full message history of a chat session
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session details
 *       404:
 *         description: Session not found
 */
router.get('/chat/:sessionId', getSessionById);

export default router; 