# LMS Backend Server

This is a simple Express server to handle file uploads for the LMS application.

## Setup

1. Open a terminal in this directory (`lms-app-frontend/server`).
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

1. Start the server:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3001`.

## Features

- Accepts file uploads at `POST /upload`.
- Saves files to the `uploads` directory.
- Supports CORS to allow requests from the frontend application.
