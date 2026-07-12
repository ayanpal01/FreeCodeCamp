require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const apiRoutes = require('./routes/api');

// Basic Configuration
const port = process.env.PORT || 3000;

// CORS middleware to allow freeCodeCamp to test our API
app.use(cors({ optionsSuccessStatus: 200 })); 

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Basic routing for the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API Routing
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Timestamp Microservice is listening on port ${port}`);
});
