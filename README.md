# Personal Storage Drive

This project is a personal storage drive application that allows users to upload files or images and access them from anywhere. It consists of a backend built with Node.js and Express, and a frontend built with HTML, CSS, and JavaScript.

## Project Structure

```
personal-storage-drive
├── backend
│   ├── src
│   │   ├── app.js          # Entry point of the backend application
│   │   ├── controllers
│   │   │   └── fileController.js  # Handles file uploads and retrieval
│   │   ├── routes
│   │   │   └── fileRoutes.js      # Sets up routes for file operations
│   │   └── middleware
│   │       └── upload.js          # Middleware for handling file uploads
│   ├── package.json       # Backend dependencies and scripts
│   └── README.md          # Documentation for the backend
├── frontend
│   ├── public
│   │   └── index.html     # Main HTML file for the frontend
│   ├── src
│   │   ├── script.js       # JavaScript for handling user interactions
│   │   └── styles.css      # CSS styles for the frontend
│   └── README.md          # Documentation for the frontend
└── README.md              # Overview of the entire project
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   node src/app.js
   ```

2. Open the frontend in a web browser:
   ```
   cd frontend
   open public/index.html
   ```

## API Endpoints

- **POST /upload**: Upload a file.
- **GET /files**: Retrieve the list of uploaded files.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.