import React, { useState, useEffect } from 'react';

const BookForm = ({ editingBook, setEditingBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title);
      setAuthor(editingBook.author);
    }
  }, [editingBook]);

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookData = { title, author };
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    try {
      if (editingBook) {
        await fetch(`http://localhost:5000/api/books/${editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
        setEditingBook(null);
      } else {
        await fetch('http://localhost:5000/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
      }
      setTitle('');
      setAuthor('');
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };
*/


const handleSubmit = async (e) => {
    e.preventDefault();
    const bookData = { title, author };
    
    // Grab the live URL or fall back to localhost
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    try {
      if (editingBook) {
        await fetch(`${BACKEND_URL}/api/books/${editingBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
        setEditingBook(null);
      } else {
        await fetch(`${BACKEND_URL}/api/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookData),
        });
      }
      setTitle('');
      setAuthor('');
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };




  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0 }}>{editingBook ? 'Edit Book Details' : 'Add New Book'}</h2>
      <div className="form-group">
        <input 
          type="text" 
          placeholder="Enter book title..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Enter author name..." 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)} 
          required 
        />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit">
          {editingBook ? 'Save Changes' : 'Add to Inventory'}
        </button>
        {editingBook && (
          <button type="button" className="secondary" onClick={() => {
            setEditingBook(null);
            setTitle('');
            setAuthor('');
          }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;