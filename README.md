# Well-Link Healthcare Application

Well-Link is a comprehensive healthcare management system built with the MERN stack (MongoDB, Express, React, Node.js).

## Prerequisites

**Node.js is required to run this application.**
Since it seems Node.js is not installed on your system, please follow these steps:

1.  **Download Node.js:** Go to [https://nodejs.org/](https://nodejs.org/) and download the LTS version.
2.  **Install:** Run the installer and follow the prompts. Ensure "Add to PATH" is checked.
3.  **Verify:** Open a new terminal and run `node -v` and `npm -v`.

## Installation

Once Node.js is installed, follow these steps to set up the project:

### 1. Backend Setup

```bash
cd server
npm install
```

### 2. Frontend Setup

```bash
cd client
npm install
```

### 3. Database Setup

Ensure you have MongoDB installed locally or use a MongoDB Atlas connection string.
Update `server/.env` with your MongoDB URI if different from default.

## Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`.

### Start the Frontend Client

```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173`.

## Features

- **Authentication:** Secure login for doctors and admins.
- **Dashboard:** Real-time overview of patients and appointments.
- **Patient Management:** Track patient details and history.
- **Appointments:** Schedule and manage visits.
- **Responsive Design:** Works on desktop and mobile.

## Project Structure

- `client/`: React Frontend
- `server/`: Express Backend
