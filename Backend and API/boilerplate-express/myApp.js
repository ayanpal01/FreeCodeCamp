require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


// Root-level logger middleware
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// Serve static files
app.use('/public', express.static(__dirname + '/public'));

// Home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// JSON route
app.get('/json', (req, res) => {
  let message = "Hello json";

  if (process.env.MESSAGE_STYLE === "uppercase") {
    message = message.toUpperCase();
  }

  res.json({ message });
});

// Time server (middleware chaining)
app.get(
  '/now',
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.json({ time: req.time });
  }
);


app.get('/:word/echo', (req, res) => {
  res.json({
    echo: req.params.word
  });
});

app.route('/name')
  .get((req, res) => {
    res.json({
      name: `${req.query.first} ${req.query.last}`
    });
  })
  .post((req, res) => {
    res.json({
      name: `${req.body.first} ${req.body.last}`
    });
  });


module.exports = app;