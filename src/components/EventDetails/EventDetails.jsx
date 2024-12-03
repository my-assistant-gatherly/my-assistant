import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Grid,
  Fab,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn,
  Description,
  ArrowBack,
  Schedule,
  Timer,
  Assignment,
  Note,
  Edit,
  Save,
  Cancel,
  Public,
  Lock,
} from '@mui/icons-material';

function EventDetails() {
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEventDetails();
    }
  }, [id, user]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user data. Please log in.');
    }
  };

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/details/${id}`);
      setEvent({
        ...response.data,
        owner_id: response.data.owner_id
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch event details. Please try again later.');
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await axios.put(`/api/events/${id}/like`);
      fetchEventDetails(); // Refresh event details to get updated likes count
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedEvent({...event});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field) => (e) => {
    setEditedEvent({
      ...editedEvent,
      [field]: e.target.value
    });
  };

  const handleSwitchChange = (field) => (e) => {
    setEditedEvent({
      ...editedEvent,
      [field]: e.target.checked
    });
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      const response = await axios.put(`/api/events/${id}`, editedEvent);
      setEvent(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update event. Please try again.');
      console.error('Error updating event:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="info">Event not found.</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg" sx={{ py: 4, mt: 7, pb: 10 }}>
        {/* Back button with improved styling */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => history.goBack()}
          sx={{
            mb: 3,
            color: '#666',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Back to Events
        </Button>

        {/* Main content */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            background: 'white',
            position: 'relative',
            overflow: 'visible'
          }}
        >
          {/* Header section with status badge */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            {isEditing ? (
              <TextField
                fullWidth
                label="Event Title"
                value={editedEvent.event_title}
                onChange={handleInputChange('event_title')}
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#2C3E50',
                  mb: 2
                }}
              >
                {event.event_title}
              </Typography>
            )}
            
            {/* Public/Private Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {isEditing ? (
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedEvent.is_public}
                      onChange={handleSwitchChange('is_public')}
                    />
                  }
                  label={editedEvent.is_public ? "Public" : "Private"}
                />
              ) : (
                <Box
                  sx={{
                    bgcolor: event.is_public ? '#4ECDC4' : '#FF6B6B',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {event.is_public ? <Public sx={{ fontSize: 16 }} /> : <Lock sx={{ fontSize: 16 }} />}
                  {event.is_public ? 'Public Event' : 'Private Event'}
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Event details grid with improved spacing and styling */}
          <Grid container spacing={4}>
            {/* Description */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'start',
                p: 3,
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Description sx={{ mr: 2, mt: 0.5, color: '#666' }} />
                {isEditing ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={editedEvent.description}
                    onChange={handleInputChange('description')}
                  />
                ) : (
                  <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>
                    {event.description || 'No description available'}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Dates */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon sx={{ mr: 2, color: '#4ECDC4' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Start Date
                      </Typography>
                      {isEditing ? (
                        <TextField
                          type="date"
                          value={editedEvent.start_date.split('T')[0]}
                          onChange={handleInputChange('start_date')}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 'medium' }}>
                          {new Date(event.start_date).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {(event.end_date || isEditing) && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon sx={{ mr: 2, color: '#FF6B6B' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          End Date
                        </Typography>
                        {isEditing ? (
                          <TextField
                            type="date"
                            value={editedEvent.end_date ? editedEvent.end_date.split('T')[0] : ''}
                            onChange={handleInputChange('end_date')}
                            fullWidth
                          />
                        ) : (
                          <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 'medium' }}>
                            {new Date(event.end_date).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Times */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Schedule sx={{ mr: 2, color: '#4ECDC4' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Start Time
                      </Typography>
                      {isEditing ? (
                        <TextField
                          type="time"
                          value={editedEvent.start_time}
                          onChange={handleInputChange('start_time')}
                          fullWidth
                        />
                      ) : (
                        <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 'medium' }}>
                          {event.start_time}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  {(event.end_time || isEditing) && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ mr: 2, color: '#FF6B6B' }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          End Time
                        </Typography>
                        {isEditing ? (
                          <TextField
                            type="time"
                            value={editedEvent.end_time || ''}
                            onChange={handleInputChange('end_time')}
                            fullWidth
                          />
                        ) : (
                          <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 'medium' }}>
                            {event.end_time}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Duration */}
            {(event.duration || isEditing) && (
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Timer sx={{ mr: 2, color: '#4ECDC4' }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Duration
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={editedEvent.duration || ''}
                          onChange={handleInputChange('duration')}
                          placeholder="e.g., 2 hours"
                          fullWidth
                        />
                      ) : (
                        <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 'medium' }}>
                          {event.duration}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            )}

            {/* Location */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 2, color: '#4ECDC4' }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Location
                    </Typography>
                    {isEditing ? (
                      <TextField
                        value={editedEvent.location}
                        onChange={handleInputChange('location')}
                        fullWidth
                      />
                    ) : (
                      <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 'medium' }}>
                        {event.location}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Tasks Section */}
          {(event.tasks?.length > 0 || isEditing) && (
            <>
              <Divider sx={{ my: 4 }} />
              <Box sx={{ 
                bgcolor: 'rgba(0,0,0,0.02)', 
                p: 3, 
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#2C3E50',
                  fontWeight: 'bold'
                }}>
                  <Assignment sx={{ mr: 1, color: '#4ECDC4' }} /> Tasks
                </Typography>
                <Box sx={{ pl: 4 }}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={editedEvent.tasks ? editedEvent.tasks.join('\n') : ''}
                      onChange={(e) => setEditedEvent({
                        ...editedEvent,
                        tasks: e.target.value.split('\n').filter(task => task.trim())
                      })}
                      placeholder="Enter tasks (one per line)"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>
                      {event.tasks.join('\n')}
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}

          {/* Notes Section */}
          {(event.notes?.length > 0 || isEditing) && (
            <>
              <Divider sx={{ my: 4 }} />
              <Box sx={{ 
                bgcolor: 'rgba(0,0,0,0.02)', 
                p: 3, 
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h6" sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  color: '#2C3E50',
                  fontWeight: 'bold'
                }}>
                  <Note sx={{ mr: 1, color: '#4ECDC4' }} /> Notes
                </Typography>
                <Box sx={{ pl: 4 }}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={editedEvent.notes ? editedEvent.notes.join('\n') : ''}
                      onChange={(e) => setEditedEvent({
                        ...editedEvent,
                        notes: e.target.value.split('\n').filter(note => note.trim())
                      })}
                      placeholder="Enter notes (one per line)"
                    />
                  ) : (
                    <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.7 }}>
                      {event.notes.join('\n')}
                    </Typography>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Paper>

        {/* Floating Edit/Save Button */}
        {user && event && user.id === event.owner_id && (
          <Fab
            color="primary"
            aria-label={isEditing ? "save" : "edit"}
            onClick={isEditing ? handleUpdate : handleEditToggle}
            disabled={updateLoading}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              background: isEditing 
                ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)'
                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: isEditing
                  ? 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)'
                  : 'linear-gradient(45deg, #1976D2 30%, #1CA7E3 90%)',
              },
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
            }}
          >
            {updateLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditing ? (
              <Save />
            ) : (
              <Edit />
            )}
          </Fab>
        )}

        {/* Cancel Edit Button */}
        {isEditing && (
          <Fab
            color="secondary"
            aria-label="cancel"
            onClick={handleEditToggle}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 100,
              background: 'linear-gradient(45deg, #FF5252 30%, #FF8A80 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #D32F2F 30%, #FF5252 90%)',
              },
              boxShadow: '0 3px 5px 2px rgba(255, 82, 82, .3)',
            }}
          >
            <Cancel />
          </Fab>
        )}
      </Container>
    </Box>
  );
}

export default EventDetails;
