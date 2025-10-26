import Session from '../models/Session.js';
import { getLLMResponse } from '../services/aiService.js';
import { v4 as uuidv4 } from 'uuid';

// Create new session with first message
export const createSession = async (req, res) => {
  try {
    const { text } = req.body;
     console.log('Creating session with text:', text);
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const aiText = await getLLMResponse(text);
    const messageObj = {
      id: uuidv4(),
      prompt: text,
      response: aiText,
      timestamp: new Date(),
    };
    const session = await Session.create({
      title: text,
      lastMessage: aiText,
      messages: [messageObj],
      timestamp: new Date(),
    });
    console.log('Session created:', session.messages);
    res.status(201).json({
      sessionId: session._id,
      title: session.title,
      messages: session.messages,
      timestamp: session.timestamp,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// Add user message to session and get AI response
export const addMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const aiText = await getLLMResponse(text);
    const messageObj = {
      id: uuidv4(),
      prompt: text,
      response: aiText,
      timestamp: new Date(),
    };
    session.messages.push(messageObj);
    session.lastMessage = aiText;
    session.timestamp = new Date();
    await session.save();
    res.json({
      message: messageObj,
      updatedSession: session,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add message' });
  }
};

// Get all recent sessions (latest first)
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({})
      // .sort({ timestamp: -1 })
      // .select('title lastMessage timestamp');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// Get full message history for a session
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    // Map messages to exclude _id and __v, and use new format
    const messages = (session.messages || []).map(msg => ({
      id: msg.id,
      prompt: msg.prompt,
      response: msg.response,
      timestamp: msg.timestamp,
    }));
    res.json({
      id: session._id,
      title: session.title,
      lastMessage: session.lastMessage,
      timestamp: session.timestamp,
      messages,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
}; 