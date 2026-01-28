const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Define storage base path
// Use /tmp in serverless environments (Vercel)
const UPLOADS_DIR = process.env.VERCEL 
    ? path.join(os.tmpdir(), 'uploads') 
    : path.join(__dirname, 'uploads');

// Ensure directory structure exists
const sections = [
    'corp_commander', 
    's1_personnel',
    's2_intelligence',
    's3_training_ops',
    's4_logistics',
    's7_cmo'
];
const types = ['incoming', 'outgoing'];

// Only create directories if not in serverless environment or if possible
try {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    sections.forEach(section => {
        types.forEach(type => {
            const dirPath = path.join(UPLOADS_DIR, section, type);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Created directory: ${dirPath}`);
            }
        });
    });
} catch (error) {
    console.warn("Could not create directories (likely ephemeral filesystem):", error.message);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { section, type } = req.body;
        if (!sections.includes(section) || !types.includes(type)) {
            return cb(new Error('Invalid section or type'));
        }
        
        // Ensure directory exists right before upload (for /tmp cleanup)
        const dest = path.join(UPLOADS_DIR, section, type);
        if (!fs.existsSync(dest)) {
             try {
                fs.mkdirSync(dest, { recursive: true });
             } catch (e) {
                return cb(new Error('Could not create upload directory'));
             }
        }
        
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes

// Upload a file
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ message: 'File uploaded successfully', file: req.file });
});

// List files in a specific section and type
app.get('/api/files/:section/:type', (req, res) => {
    const { section, type } = req.params;
    
    if (!sections.includes(section) || !types.includes(type)) {
        return res.status(400).json({ error: 'Invalid section or type' });
    }

    const dirPath = path.join(UPLOADS_DIR, section, type);
    
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        
        // Get file stats
        const fileInfos = files.map(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            return {
                name: file,
                size: stats.size,
                createdAt: stats.birthtime
            };
        });

        res.json(fileInfos);
    });
});

// Download a file
app.get('/api/download/:section/:type/:filename', (req, res) => {
    const { section, type, filename } = req.params;
    const filePath = path.join(UPLOADS_DIR, section, type, filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// For Vercel, we need to export the app
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
