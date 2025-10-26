# Fire Assistant AI – Chat Support Backend

A secure, scalable backend API for fire safety and emergency response chat, built with Node.js, Express, and MongoDB.

## Features
- Chat session management
- Message storage and retrieval
- Real AI responses (OpenRouter via LangChain)
- Modular, clean ES6+ codebase

## Tech Stack
- Node.js, Express
- MongoDB, Mongoose
- Zod (validation), Morgan (logging)
- LangChain (LLM integration)
- Ready for OpenRouter, OpenAI, web search

## Setup
1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment**
   - Copy `.env` and set your `MONGODB_URI` and `OPEN_ROUTER` key
4. **Start MongoDB** (if local)
5. **Run the server**
   ```bash
   npm run dev
   ```

## API Documentation
- **Swagger UI:** [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
- All endpoints are documented and testable in Swagger UI.

---

# API Routes & Frontend Usage

## 1. POST `/api/chat`
**Start a new chat session with the first user message.**

**Request:**
```json
POST /api/chat
Content-Type: application/json
{
  "text": "How can I prevent kitchen fires?"
}
```

**Response:**
```json
{
  "sessionId": "1234567890",
  "title": "How can I prevent kitchen fires?",
  "messages": [
    { "id": "...", "text": "...", "isUser": true, "timestamp": "..." },
    { "id": "...", "text": "...", "isUser": false, "timestamp": "..." }
  ],
  "timestamp": "2025-07-21T19:00:00Z"
}
```

**React Native Example:**
```js
const res = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: userMessage }),
});
const data = await res.json();
setSessionId(data.sessionId);
setMessages(data.messages);
```

---

## 2. POST `/api/chat/:sessionId/message`
**Add a new user message to an existing session and get the AI’s reply.**

**Request:**
```json
POST /api/chat/1234567890/message
Content-Type: application/json
{
  "text": "What should I do during a fire evacuation?"
}
```

**Response:**
```json
{
  "message": { "id": "...", "text": "...", "isUser": true, "timestamp": "..." },
  "aiResponse": { "id": "...", "text": "...", "isUser": false, "timestamp": "..." },
  "updatedSession": { ... }
}
```

**React Native Example:**
```js
const res = await fetch(`/api/chat/${sessionId}/message`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: userMessage }),
});
const data = await res.json();
setMessages([...messages, data.message, data.aiResponse]);
```

---

## 3. GET `/api/chat`
**Get a list of recent chat sessions.**

**Response:**
```json
[
  {
    "id": "1",
    "title": "Fire Safety Tips",
    "lastMessage": "How can I prevent kitchen fires?",
    "timestamp": "2025-07-21T17:45:00Z"
  },
  ...
]
```

**React Native Example:**
```js
const res = await fetch('/api/chat');
const sessions = await res.json();
setSessions(sessions);
```

---

## 4. GET `/api/chat/:sessionId`
**Get the full message history for a session.**

**Response:**
```json
{
  "id": "1",
  "title": "Fire Safety Tips",
  "messages": [
    { "id": "1", "text": "...", "isUser": false, "timestamp": "..." },
    ...
  ]
}
```

**React Native Example:**
```js
const res = await fetch(`/api/chat/${sessionId}`);
const session = await res.json();
setMessages(session.messages);
```

---

## Best Practices
- Always check for errors in responses.
- Use the Swagger UI for up-to-date docs and live testing.
- Keep your frontend and backend in sync with endpoint changes.

---

## Folder Structure
```
/src
  /config        # DB config
  /models        # Mongoose schemas
  /controllers   # Business logic
  /routes        # Express routers
  /middleware    # Logging, validation
  /services      # AI integration
  /utils         # Helpers
  app.js         # Express app
  server.js      # Entry point
```

## License
MIT
