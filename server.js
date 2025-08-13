const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const subject = req.body.subject;
        const dir = path.join(__dirname, 'uploads', subject);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Upload route
app.post('/upload', upload.single('noteFile'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
});

// File listing route
app.get('/files', (req, res) => {
    const subject = req.query.subject;
    const subjectDir = path.join(__dirname, 'uploads', subject);

    if (!fs.existsSync(subjectDir)) {
        return res.json([]);
    }

    const files = fs.readdirSync(subjectDir).map(filename => ({
        name: filename,
        url: `/uploads/${subject}/${filename}`
    }));

    res.json(files);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
