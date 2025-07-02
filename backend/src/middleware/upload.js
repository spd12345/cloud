const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original file name
  }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/; // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File type not allowed'), false);
};

// Initialize multer with the storage and file filter options
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: fileFilter
});

// Export the upload middleware
module.exports = upload.single('file'); // 'file' is the name of the input field in the form