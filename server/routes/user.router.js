const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const axios = require('axios');
const FormData = require('form-data'); 
const router = express.Router();




// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
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

router.post('/image/upload', rejectUnauthenticated, async (req, res) => {
  try {
    if (!req.files || !req.files.file) { // Change this line to use req.files.file
      return res.status(400).send('No file provided');
    }

    const file = req.files.file; // Use req.files.file instead of req.body.file
    const formData = new FormData();
    formData.append('file', file.data); // Use file.data to get the file buffer
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET); // Ensure your .env has this key

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      { headers: formData.getHeaders() }
    );

    // Send back the Cloudinary URL for the uploaded image
    res.status(200).send({ url: response.data.secure_url });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).send('Failed to upload image');
  }
});


router.put('/', rejectUnauthenticated, async (req, res) => {
  const { fullname, user_title, skills, zip_code, image_url } = req.body;
  const userId = req.user.id;

  const queryText = `
    UPDATE "user"
    SET 
      fullname = $1, 
      user_title = $2, 
      skills = $3, 
      zip_code = $4, 
      image_url = $5,
      updated_at = NOW()
    WHERE id = $6;
  `;

  try {
    await pool.query
    (queryText, [fullname, user_title, skills, zip_code, image_url, userId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.sendStatus(500);
  }
});


module.exports = router;
