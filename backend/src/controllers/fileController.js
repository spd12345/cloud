class FileController {
    constructor() {
        this.files = []; // In-memory storage for uploaded files
    }

    uploadFile(req, res) {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }
        this.files.push(file); // Store the file in memory
        res.status(200).send({ message: 'File uploaded successfully', file });
    }

    getFiles(req, res) {
        res.status(200).send(this.files); // Return the list of uploaded files
    }
}

export default new FileController();