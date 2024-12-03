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
  const [previewImage, setPreviewImage] = useState(null);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Only JPEG, PNG, and GIF images are allowed.');
        event.target.value = ''; // Clear the file input
        return;
      }

      if (file.size > maxSize) {
        alert('File is too large. Maximum file size is 5MB.');
        event.target.value = ''; // Clear the file input
        return;
      }

      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setIsPhotoSelected(true);
      };
      reader.readAsDataURL(file);
      
      // Set the file for upload
      setNewImage(file);
    }
  };

  const handlePhotoUpdate = async () => {
    if (!newImage) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', newImage);

      const response = await fetch('/api/user/image-upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        // Update local state
        setFormData(prev => ({
          ...prev,
          image_url: data.imageUrl
        }));
        
        // Update Redux store
        dispatch({ type: 'FETCH_USER' });
        
        // Reset upload states
        setNewImage(null);
        setIsPhotoSelected(false);
        setPreviewImage(null);
        
        alert('Profile photo updated successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const uploadData = new FormData();
    
    // Append all form data
    Object.keys(formData).forEach(key => {
      uploadData.append(key, formData[key]);
    });

    // Append image if selected
    if (newImage) {
      uploadData.append('image', newImage, newImage.name);
    }

    try {
      await axios.put('/api/user', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
            src={previewImage || formData.image_url || '/Images/userAvatar.png'}
            alt="Profile"
            className="profile-pic"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {isPhotoSelected && (
            <button 
              type="button" 
              className="update-photo-btn"
              onClick={handlePhotoUpdate}
              disabled={isUploading}
            >
              {isUploading ? 'Updating...' : 'Update Photo'}
            </button>
          )}
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
