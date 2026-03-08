/*const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows our React frontend to make requests here
app.use(express.json()); // Allows us to parse JSON bodies in POST/PUT requests

const server = http.createServer(app);

// Initialize Socket.io with CORS configured for React's default port (3000)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT"]
  }
});

// In-memory array acting as our database for this task
let books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Andrew Hunt' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin' }
];

// Handle real-time connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send the current list of books to the client immediately upon connection
  socket.emit('initialData', books);

  // Handle graceful disconnections
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// REST API Route: Add a new book
app.post('/api/books', (req, res) => {
  const newBook = { id: Date.now(), ...req.body };
  books.push(newBook);
  
  // REAL-TIME BROADCAST: Notify ALL connected clients of the updated list
  io.emit('bookListUpdated', books);
  
  res.status(201).json(newBook);
});

// REST API Route: Update an existing book
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...req.body };
    
    // REAL-TIME BROADCAST: Notify ALL connected clients of the updated list
    io.emit('bookListUpdated', books);
    
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
*/


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// NEW: Use environment variables for deployment
// In production, Render will provide the PORT, and we'll provide the FRONTEND_URL.
// Locally, it will fall back to port 5000 and localhost:3000.
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 5000;

// Enable CORS for Express REST API routes
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT"]
}));
app.use(express.json());

const server = http.createServer(app);

// Initialize Socket.io with CORS configured for our frontend URL
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, 
    methods: ["GET", "POST", "PUT"]
  }
});

// In-memory array acting as our database for this task
let books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Andrew Hunt' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin' }
];

// Handle real-time connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send the current list of books to the client immediately upon connection
  socket.emit('initialData', books);

  // Handle graceful disconnections
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// REST API Route: Add a new book
app.post('/api/books', (req, res) => {
  const newBook = { id: Date.now(), ...req.body };
  books.push(newBook);
  
  // REAL-TIME BROADCAST: Notify ALL connected clients of the updated list
  io.emit('bookListUpdated', books);
  
  res.status(201).json(newBook);
});

// REST API Route: Update an existing book
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...req.body };
    
    // REAL-TIME BROADCAST: Notify ALL connected clients of the updated list
    io.emit('bookListUpdated', books);
    
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});