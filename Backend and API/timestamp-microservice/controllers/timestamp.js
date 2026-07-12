/**
 * Handler for GET /api/
 * Returns the current timestamp in unix and utc format.
 */
exports.getCurrentTime = (req, res) => {
  const now = new Date();
  return res.json({
    unix: now.getTime(),
    utc: now.toUTCString()
  });
};

/**
 * Handler for GET /api/:date
 * Parses the given date string or unix timestamp and returns the time.
 */
exports.getParsedTime = (req, res) => {
  const dateString = req.params.date;
  let date;

  // Check if the date string is entirely numeric (Unix timestamp)
  // We use regex to check if it contains only digits.
  if (/^\d+$/.test(dateString)) {
    // If it's all digits, we convert it to an integer before passing to Date constructor
    date = new Date(parseInt(dateString));
  } else {
    // Otherwise, parse it as a standard date string
    date = new Date(dateString);
  }

  // Validate the resulting Date object
  // If the date is invalid, date.getTime() returns NaN.
  if (isNaN(date.getTime())) {
    return res.json({ error: 'Invalid Date' });
  }

  // If valid, return the parsed time
  return res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
};
