# Personal Storage Drive Backend

This is the backend for the Personal Storage Drive application. It allows users to upload and retrieve files from a personal storage drive accessible from anywhere.

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd personal-storage-drive/backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root of the backend directory and add the necessary environment variables, such as database connection strings.

4. **Run the application:**
   ```
   npm start
   ```

## API Endpoints

### File Upload

- **POST** `/api/files/upload`
  - Description: Uploads a file to the server.
  - Request Body: Form-data containing the file.

### Retrieve Files

- **GET** `/api/files`
  - Description: Retrieves a list of uploaded files.
  - Response: JSON array of file metadata.

## Directory Structure

- `src/app.js`: Entry point of the application.
- `src/controllers/fileController.js`: Contains logic for file handling.
- `src/routes/fileRoutes.js`: Defines the routes for file operations.
- `src/middleware/upload.js`: Middleware for handling file uploads.

## Dependencies

- Express: Web framework for Node.js.
- Multer: Middleware for handling multipart/form-data, primarily used for uploading files.

## License

This project is licensed under the MIT License.