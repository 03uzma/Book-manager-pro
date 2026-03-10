const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 5000;

// Enabled CORS for Express REST API routes
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT"]
}));
app.use(express.json());

const server = http.createServer(app);

// Socket.io with CORS configured for frontend URL
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


io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.emit('initialData', books);

  // Handle graceful disconnections
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.post('/api/books', (req, res) => {
  const newBook = { id: Date.now(), ...req.body };
  books.push(newBook);
  
  // REAL-TIME BROADCAST: Notify ALL connected clients of the updated list
  io.emit('bookListUpdated', books);
  
  res.status(201).json(newBook);
});


app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...req.body };
    
    
    io.emit('bookListUpdated', books);
    
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});