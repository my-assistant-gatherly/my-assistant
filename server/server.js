const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const eventsRouter = require('./routes/events.router');

// Body parser middleware with increased limits
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors());

// Multer configuration
const upload = multer({
  dest: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
});

// Passport Session Configuration
app.use(sessionMiddleware);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/events', eventsRouter);

// Serve static files
app.use(express.static('build'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Clean up any temporary files
  if (req.file) {
    fs.unlink(req.file.path).catch(console.error);
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
