# BookManager Pro: Real-Time Book Management System

This project is a full-stack implementation of a real-time book management system. It enables instant synchronization of inventory changes (Add/Edit) across all connected clients using WebSocket technology, ensuring a seamless user experience without manual page refreshes.

Frontend deployed link: https://book-manager-pro.vercel.app

Backend deployed link: https://book-manager-pro-backend.onrender.com


---

## Technology Stack

* **Frontend:** React.js (Hooks & Functional Components)    
* **Backend:** Node.js & Express
* **Real-Time Engine:** **Socket.io (WebSockets)** : Selected for its robust event-driven architecture, automatic reconnection handling, and built-in heartbeat packets which ensure high reliability for real-time synchronization.
* **Deployment:** Vercel (Frontend) & Render (Backend)

---

## Real-Time Feature Implementation

### 1. The Real-Time Flow
The application utilizes a **Push-on-Change** model to maintain data integrity:
1.  **Action:** An Admin performs a `POST` or `PUT` request via the `BookForm`.
2.  **Server Update:** The Express server updates the data array.
3.  **Broadcast:** Upon success, the server executes `io.emit('bookListUpdated', books)`, pushing the new state to **every** connected socket.
4.  **Client Sync:** The React frontend "subscribes" to this event within a `useEffect` hook, updating its local state and triggering an immediate re-render.

### 2. Installation & Local Setup
Clone the repository:
```
Bash
git clone https://github.com/03uzma/Book-manager-pro
```
Install dependencies:
Run npm install in both the backend and frontend directories.

Environment Variables:
Set REACT_APP_BACKEND_URL=http://localhost:5000 in the frontend .env.

Run Locally:
Start the backend with node server.js and the frontend with npm start.

### 3. Testing & Deployment Summary
Multi-Client Synchronization Test
Method: Opened two separate browser windows (one Admin, one User) side-by-side.

Observation: Adding or Editing a book in the Admin window resulted in an update in the User window without any manual interaction.

Resilience & Error Handling
Connection Indicator: The UI features a status badge (Live/Offline) to provide immediate feedback on connection health.

Graceful Recovery: Verified that if the connection drops, the client successfully reconnects and re-fetches the initial state once the server is back online.

### 4. Maintenance & Troubleshooting Guide
Status Indicator is Red (Offline): Check if the backend server is waking up (Render cold-start may take ~30s).

Verify the REACT_APP_BACKEND_URL matches the deployed backend link.

Updates Not Reflecting: Open DevTools > Network > WS. Verify the 101 Switching Protocols status for the socket.io handshake.

Check for CORS errors in the console to ensure the Vercel URL is whitelisted in server.js.


##  How to Use the Application
Open the App: Go to https://book-manager-pro.vercel.app.

Dual Windows: Open the same link in two windows side-by-side.

Set Roles: Set one window to Admin and the other to User.

Real-time Test: Add or Edit a book in the Admin window.

Observe: The User window will update instantly without a page refresh.
