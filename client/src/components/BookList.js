import React from 'react';
const BookList = ({ books, setEditingBook, role }) => {
  return (
    <div>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Current Book List</h2>
      {books.length === 0 ? (
        <div className="empty-state">
          <p>No books available.</p>
        </div>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>By {book.author}</p>
              </div>
              
              {role === 'admin' && (
                <button 
                  className="secondary"
                  onClick={() => setEditingBook(book)}
                >
                  Edit
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;