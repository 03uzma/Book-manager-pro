import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './App.css';

// NEW: Use environment variable for the live backend URL, fallback to localhost for local testing
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const socket = io(BACKEND_URL);

function App() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [role, setRole] = useState('user'); // Default to regular user view

  useEffect(() => {
    // 1. Connection Event Listeners (Graceful Error Handling)
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // 2. Data Event Listeners
    socket.on('initialData', (data) => setBooks(data));
    socket.on('bookListUpdated', (updatedBooks) => setBooks(updatedBooks));

    // 3. Cleanup function to prevent memory leaks
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('initialData');
      socket.off('bookListUpdated');
    };
  }, []);

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      
      {/* Sleek Top Corner Connection Indicator */}
      <div className="connection-indicator">
        <div className={`status-dot ${isConnected ? 'dot-connected' : 'dot-disconnected'}`}></div>
        {isConnected ? 'Live' : 'Offline'}
      </div>

      <header className="header">
        <h1>BookManager Pro</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time inventory synchronization</p>
      </header>

      {/* Role Toggle Dropdown */}
      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>View application as: </label>
        <select 
          value={role} 
          onChange={(e) => {
            setRole(e.target.value);
            setEditingBook(null); // Clear the form if they switch roles while editing
          }} 
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}
        >
          <option value="user">Regular User (Read-Only)</option>
          <option value="admin">Admin (Can Add/Edit)</option>
        </select>
      </div>

      <main>
        {/* Only render the BookForm if the user is acting as an Admin */}
        {role === 'admin' && (
          <div className="card">
            <BookForm editingBook={editingBook} setEditingBook={setEditingBook} />
          </div>
        )}
        
        <div className="card">
          {/* Pass the role to BookList so it knows whether to hide the Edit buttons */}
          <BookList books={books} setEditingBook={setEditingBook} role={role} />
        </div>
      </main>

    </div>
  );
}

export default App;