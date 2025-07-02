# Personal Storage Drive

This project is a personal storage drive application that allows users to upload files or images and access them from anywhere. It consists of a backend built with Node.js and Express, and a frontend developed using HTML, CSS, and JavaScript.

## Project Structure

```
personal-storage-drive
├── backend
│   ├── src
│   │   ├── app.js
│   │   ├── controllers
│   │   │   └── fileController.js
│   │   ├── routes
│   │   │   └── fileRoutes.js
│   │   └── middleware
│   │       └── upload.js
│   ├── package.json
│   └── README.md
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── script.js
│   │   └── styles.css
│   └── README.md
└── README.md
```

## Frontend Setup

1. Navigate to the `frontend` directory.
2. Open `public/index.html` in a web browser to view the application.
3. The frontend communicates with the backend to handle file uploads and retrieval.

## Backend Setup

1. Navigate to the `backend` directory.
2. Install the required dependencies by running:
   ```
   npm install
   ```
3. Start the server using:
   ```
   npm start
   ```
4. The backend API will be available for handling file uploads and retrieval.

## Usage

- Users can upload files through the frontend interface.
- Uploaded files can be accessed and managed from the application.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.