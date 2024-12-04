import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
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
    if (!newImage) return;

    const formData = new FormData();
    formData.append('file', newImage);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      setFormData({ ...formData, image_url: response.data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newImage) {
      await handleImageUpload();
    }

    try {
      await axios.put('/api/user', formData); // Update user info endpoint
      dispatch({ type: 'FETCH_USER' }); // Refresh user data
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-pic-container">
          <img
            src={formData.image_url || '/default-profile.png'} // I will select a Default profile picture
            alt="Profile"
            className="profile-pic"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </div>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="user_title"
            value={formData.user_title}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Skills:</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Zip Code:</label>
          <input
            type="text"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleInputChange}
          />
        </div>
        <div className="button-group">
          <button type="submit" className="save-btn">
            Save
          </button>
          <button type="button" className="back-btn" onClick={() => window.history.back()}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserProfile;