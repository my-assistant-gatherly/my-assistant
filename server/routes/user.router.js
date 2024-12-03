const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const cloudinary = require('../modules/cloudinary.config');
const multer = require('multer');
const fs = require('fs').promises;

const router = express.Router();

// Configure multer for image upload
const upload = multer({
  dest: '/tmp/',
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Middleware to ensure file upload is possible
const ensureFileUpload = (req, res, next) => {
  // Log incoming request details
  console.log('File Upload Request Details:', {
    method: req.method,
    path: req.path,
    contentType: req.headers['content-type'],
    files: req.files
  });

  // Check if file upload middleware is working
  if (!req.files) {
    console.error('File upload middleware not initialized');
    return res.status(400).json({
      error: 'File upload middleware not configured',
      details: 'Please ensure express-fileupload is correctly set up'
    });
  }

  next();
};

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Added GET /search for autocomplete functionality
router.get('/search', rejectUnauthenticated, async (req, res) => {
  const searchQuery = req.query.query;

  if (!searchQuery) {
    return res.status(400).send('Search query is required'); // Validates that a query is provided
  }

  try {
    const sqlQuery = `
      SELECT id, fullname, username, image_url
      FROM "user"
      WHERE "fullname" ILIKE $1 OR "username" ILIKE $1
      LIMIT 10;
    `;
    const values = [`%${searchQuery}%`];
    const result = await pool.query(sqlQuery, values);
    res.status(200).json(result.rows); // Returns matching users
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
    res.status(500).send('Internal server error');
  }
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const fullname = req.body.fullname;
  const user_title = req.body.user_title;
  const skill = req.body.skill;
  const zipcode = req.body.zipcode;
    
  const queryText = `INSERT INTO "user" (username, password, fullname, user_title, skills, zip_code)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
  pool
    .query(queryText, [username, password, fullname, user_title, skill, zipcode])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

// Dedicated route for image upload
router.post('/image-upload', 
  rejectUnauthenticated,
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded'
        });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Update database
      const query = `
        UPDATE "user"
        SET image_url = $1
        WHERE id = $2
        RETURNING image_url
      `;

      await pool.query(query, [result.secure_url, req.user.id]);

      // Clean up the temporary file
      await fs.unlink(req.file.path);

      res.json({
        imageUrl: result.secure_url
      });

    } catch (error) {
      console.error('Upload error:', error);

      // Clean up the temporary file if it exists
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }

      res.status(500).json({
        error: 'Failed to upload image'
      });
    }
  }
);

// Update user profile route with file upload support
router.put('/', 
  rejectUnauthenticated,
  upload.single('image'),
  async (req, res) => {
    const { 
      fullname, 
      user_title, 
      skills, 
      zip_code, 
      image_url 
    } = req.body;
    const userId = req.user.id;

    let cloudinaryUrl = image_url;

    // If a file was uploaded, upload to Cloudinary
    if (req.file) {
      try {
        // Log file details for debugging
        console.log('Uploaded file:', {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          path: req.file.path,
          size: req.file.size
        });

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'user_avatars',
          public_id: `user_${userId}_avatar`
        });
        cloudinaryUrl = result.secure_url;

        // Remove temporary file
        await fs.unlink(req.file.path);
      } catch (error) {
        console.error('Cloudinary upload error:', {
          message: error.message,
          stack: error.stack,
          cloudinaryError: error
        });

        // Remove temporary file even if upload fails
        if (req.file) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error('Error removing temporary file:', unlinkError);
          }
        }

        return res.status(500).json({ 
          error: 'Image upload failed', 
          details: error.message 
        });
      }
    }

    const queryText = `
      UPDATE "user" 
      SET 
        fullname = $1, 
        user_title = $2, 
        skills = $3, 
        zip_code = $4, 
        image_url = $5 
      WHERE id = $6
    `;

    try {
      await pool.query(queryText, [
        fullname, 
        user_title, 
        skills, 
        zip_code, 
        cloudinaryUrl, 
        userId
      ]);
      res.sendStatus(200);
    } catch (error) {
      console.error('Update user profile error:', {
        message: error.message,
        stack: error.stack,
        sqlError: error
      });
      res.status(500).json({ 
        error: 'Profile update failed', 
        details: error.message 
      });
    }
  }
);

module.exports = router;
