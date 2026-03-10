import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import './App.css';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const socket = io(BACKEND_URL);

function App() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [role, setRole] = useState('user'); 
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // 1. Connection Event Listeners
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // 2. Data Event Listeners
    socket.on('initialData', (data) => setBooks(data));
    socket.on('bookListUpdated', (updatedBooks) => setBooks(updatedBooks));

    // 3. Keep-Alive Heartbeat (Prevents sleep while user is active)
    const keepAlive = setInterval(() => {
      fetch(`${BACKEND_URL}/api/books`)
        .then(() => console.log("Heartbeat: Server is awake"))
        .catch((err) => console.error("Heartbeat: Wake-up call failed", err));
    }, 10 * 60 * 1000); 

    return () => {
      clearInterval(keepAlive);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('initialData');
      socket.off('bookListUpdated');
    };
  }, []);

  // Landing Screen
  if (!hasStarted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--background, #f4f7f6)', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '500px' }}>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>BookManager Pro</h1>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>Please select your role to continue:</p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button 
              onClick={() => { setRole('admin'); setHasStarted(true); }}
              style={{ padding: '15px 25px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
               Enter as Admin
            </button>
            
            <button 
              onClick={() => { setRole('user'); setHasStarted(true); }}
              style={{ padding: '15px 25px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
               Enter as User
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="app-container" style={{ position: 'relative' }}>
      <div className="connection-indicator">
        <div className={`status-dot ${isConnected ? 'dot-connected' : 'dot-disconnected'}`}></div>
        {isConnected ? 'Live' : 'Offline'}
      </div>

     
      <header className="header">
        <h1>BookManager Pro</h1>
        <p style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '1.1rem' }}>
           Book-Library 
        </p>
      </header>

      <div style={{ textAlign: 'center', margin: '16px 0 32px 0' }}>
        <span style={{ 
          padding: '8px 16px', 
          borderRadius: '20px', 
          backgroundColor: role === 'admin' ? '#cce5ff' : '#d4edda', 
          color: role === 'admin' ? '#004085' : '#155724',
          fontWeight: 'bold',
          fontSize: '14px',
          border: `1px solid ${role === 'admin' ? '#b8daff' : '#c3e6cb'}`
        }}>
          {role === 'admin' ? 'Admin View (Full Access)' : 'User View (Read-Only)'}
        </span>
      </div>

      <main>
        {role === 'admin' && (
          <div className="card">
            <BookForm editingBook={editingBook} setEditingBook={setEditingBook} />
          </div>
        )}
        
        <div className="card">
          <BookList books={books} setEditingBook={setEditingBook} role={role} />
        </div>
      </main>

    </div>
  );
}

export default App;