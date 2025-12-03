const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        // Use original name or timestamp + original name to avoid conflicts
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const loanId = req.body.loanId;
    console.log(`File uploaded: ${req.file.filename} for Loan ID: ${loanId}`);

    // Here you could move the file to a specific folder based on loanId if needed

    res.send({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: req.file.path
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
