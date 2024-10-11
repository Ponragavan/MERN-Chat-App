# InstantInteract - Real-Time Chat Application

[Live Demo](https://instantinteract.netlify.app/)

## Project Overview

**InstantInteract** is a full-stack real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) with real-time communication powered by Socket.IO. The application includes features such as authentication (register/login), group chats, profile and group editing, making it a robust platform for users to interact seamlessly.

## Features

- **Authentication**: Users can sign up, log in, and manage their profiles securely.
- **Real-Time Chat**: Leverages Socket.IO to provide real-time messaging between users.
- **Group Chat**: Create and manage group chats with multiple users.
- **Profile Editing**: Users can update their profile details.
- **Group Management**: Edit group details such as the name and members.
- **Responsive UI**: The frontend is designed using React and Tailwind CSS, ensuring a responsive and clean user interface.

## Tech Stack

### Frontend
- **React**: Frontend library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Socket.IO**: Real-time communication for messaging.
- **Netlify**: Hosting for the frontend.

### Backend
- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Web framework for building REST APIs.
- **MongoDB**: NoSQL database for storing user data and messages.
- **Socket.IO**: Enables real-time, bidirectional communication between the client and server.
- **Render**: Hosting for the backend.

## Installation and Setup

To run this project locally, follow these steps:

### Prerequisites
- Node.js
- MongoDB

### Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Ponragavan/MERN-Chat-App.git
    cd MERN-Chat-App/server
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a .env file in the backend root directory with the following environment variables:
    ```bash
    DB_URL = 
    FRONTEND_URL = 
    JWT_SECRET = 
    NODE_ENV = 
    ```

4. Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd ../client
    ```

2. Install dependencies
    ```bash
    npm install
    ```
3. Create a .env file in the frontend root directory with the following environment variables
    ```bash
    VITE_BACKEND_URL =
    ```

4. Start the frontend:
    ```bash
    npm run dev
    ```