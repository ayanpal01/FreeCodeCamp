require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI);

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});

const UrlModel = mongoose.model('Url', urlSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  // Validate the URL format using the URL module
  let parsedUrl;
  try {
    parsedUrl = new URL(originalUrl);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // Only allow http and https protocols
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return res.json({ error: 'invalid url' });
  }

  // Verify hostname exists
  dns.lookup(parsedUrl.hostname, (err, address) => {
    if (err || !address) {
      return res.json({ error: 'invalid url' });
    }

    // Check if it already exists
    UrlModel.findOne({ original_url: originalUrl }, (err, existingDoc) => {
      if (err) return res.json({ error: 'Server error' });
      
      if (existingDoc) {
        return res.json({
          original_url: existingDoc.original_url,
          short_url: existingDoc.short_url
        });
      }

      // Generate a new short URL (using the count of documents as a simple ID)
      UrlModel.countDocuments({}, (err, count) => {
        if (err) return res.json({ error: 'Server error' });
        
        const newDoc = new UrlModel({
          original_url: originalUrl,
          short_url: count + 1
        });

        newDoc.save((err, savedDoc) => {
          if (err) return res.json({ error: 'Server error' });
          res.json({
            original_url: savedDoc.original_url,
            short_url: savedDoc.short_url
          });
        });
      });
    });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  if (isNaN(shortUrl)) {
    return res.json({ error: 'invalid url' });
  }

  UrlModel.findOne({ short_url: shortUrl }, (err, existingDoc) => {
    if (err) return res.json({ error: 'Server error' });
    if (!existingDoc) return res.json({ error: 'No short URL found for the given input' });

    res.redirect(existingDoc.original_url);
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
