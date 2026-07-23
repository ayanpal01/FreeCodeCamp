const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files
app.use('/public', express.static(process.cwd() + '/public'));

// Home page
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Multer configuration
const storage = multer.memoryStorage();
// const upload = multer({ storage });
const upload = multer();

// File Metadata API
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file uploaded'
    });
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// Listen
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;