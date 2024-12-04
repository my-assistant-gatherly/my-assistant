import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import './UserProfile.css';

function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const [formData, setFormData] = useState({
    fullname: user.fullname || '',
    user_title: user.user_title || '',
    skills: user.skills || '',
    zip_code: user.zip_code || '',
    image_url: user.image_url || '',
  });

  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    // Populate the form when user data changes
    setFormData({
      fullname: user.fullname || '',
      user_title: user.user_title || '',
      skills: user.skills || '',
      zip_code: user.zip_code || '',
      image_url: user.image_url || '',
    });
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async () => {
    if (!newImage) return null;

    const uploadData = new FormData();
    uploadData.append('file', newImage);
    uploadData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        uploadData
      );
      console.log('Image uploaded to Cloudinary:', response.data.url);
      return response.data.url; // Return the URL after uploading
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let uploadedImageUrl = formData.image_url;

    // If there's a new image, upload it and get the URL
    if (newImage) {
      uploadedImageUrl = await handleImageUpload();
      if (!uploadedImageUrl) {
        alert('Failed to upload image.');
        return;
      }
    }

    const updatedData = { ...formData, image_url: uploadedImageUrl };

    try {
      await axios.put('/api/user', updatedData); // Update user info endpoint
      dispatch({ type: 'FETCH_USER' }); // Refresh user data
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 5 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
          User Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginBottom={3}
          >
            <Avatar
              src={formData.image_url || '/Images/11539820.png'} // Default profile picture
              alt="Profile Picture"
              sx={{
                width: 120, // Adjust size as needed
                height: 120,
                borderRadius: '50%', // Ensures circular borders
                border: '3px solid #ccc', // Optional: adds a border around the avatar
                boxShadow: 3,
              }}
            />
            <Button
              variant="contained"
              component="label"
              className="upload-button"
              sx={{ marginTop: 2 }}
            >
              Upload New Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </Button>
          </Box>

          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="user_title"
                value={formData.user_title}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Zip Code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="space-between" marginTop={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="save-button"
              sx={{
                paddingX: 3,
                paddingY: 1,
                borderRadius: 2,
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              className="back-button"
              sx={{
                paddingX: 3,
                paddingY: 2,
                // paddingZ 1,
    
                borderRadius: 2,
              }}
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default UserProfile;

