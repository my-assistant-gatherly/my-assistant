// Import necessary React hooks for component functionality
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// Import Material UI components for styling and UI elements
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Paper
} from '@mui/material';

// Import Material UI icons for visual enhancement
import {
  ThumbUp,
  Add,
  Search,
  LocationOn,
  Event,
  Description,
  Public,
  Lock
} from '@mui/icons-material';

// Import custom CSS
import './ViewEvents.css';

/**
 * ViewEvents component: Displays a list of events with filtering and liking functionality.
 */
function ViewEvents() {
  // Initialize routing history for navigation
  const history = useHistory();

  // State management using React hooks
  const [events, setEvents] = useState([]); // Store list of events
  const [filter, setFilter] = useState('all'); // Track filter selection
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Store error messages
  const [user, setUser] = useState(null); // Store user information

  /**
   * Effect hook to fetch user data when component mounts.
   */
  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * Effect hook to fetch events when user or filter changes.
   */
  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
  }, [filter, user]);

  /**
   * Function to fetch user data from the server.
   */
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user data. Please log in.');
      console.error('Error fetching user:', err);
    }
  };

  /**
   * Function to fetch events data from the server.
   */
  const fetchEvents = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/${user.id}`);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to handle the like button click.
   * @param {number} eventId - ID of the event to like.
   */
  const handleLike = async (eventId) => {
    try {
      // Optimistic update: Update UI immediately before server response
      setEvents(events.map(event => {
        if (event.id === eventId) {
          return { ...event, total_likes: (event.total_likes || 0) + 1 };
        }
        return event;
      }));

      // Make API call to update likes in the database
      await axios.put(`/api/events/${eventId}/like`);
    } catch (err) {
      console.error('Error updating likes:', err);
      // If API call fails, refresh events to get correct data
      fetchEvents();
    }
  };

  /**
   * Function to handle filter change.
   * @param {object} e - Event object.
   */
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const getFilteredEvents = () => {
    switch (filter) {
      case 'my-events':
        return events.filter(event => event.owner_id === user.id);
      case 'invite-only':
        return events.filter(event => !event.is_public && event.owner_id !== user.id);
      case 'all':
      default:
        return events.filter(event => event.is_public || event.owner_id === user.id);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 7}}>
      {/* Header section with gradient background */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ color: 'white', fontWeight: 'bold'}}>
          Events
        </Typography>
      </Paper>
      
      {/* Controls section: Filter and action buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Filter dropdown */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filter-label">Filter Events</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Filter Events"
            onChange={handleFilterChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0,0,0,0.1)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4ECDC4',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4ECDC4',
              }
            }}
          >
            <MenuItem value="all">All Events</MenuItem>
            <MenuItem value="my-events">My Events</MenuItem>
            <MenuItem value="invite-only">Invite-Only</MenuItem>
          </Select>
        </FormControl>
        
        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Search button with gradient */}
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={() => history.push('/search-events')}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Search
          </Button>
          {/* Create event button with gradient */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => history.push('/create-events')}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
            }}
          >
            Create Event
          </Button>
        </Box>
      </Box>

      {/* Conditional rendering based on component state */}
      {loading ? (
        // Show loading spinner when fetching data
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        // Show error message if something goes wrong
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : events.length === 0 ? (
        // Show message when no events are found
        <Alert severity="info">No events found.</Alert>
      ) : (
        // Display grid of event cards
        <Grid container spacing={3}>
          {getFilteredEvents().map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              {/* Event card with hover animation */}
              <Card 
                onClick={() => history.push(`/event/${event.id}`)}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'visible',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {/* Public Event Badge for all public events */}
                {event.is_public && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      backgroundColor: '#4ECDC4',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 8px rgba(78,205,196,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      zIndex: 1,
                    }}
                  >
                    <Public sx={{ fontSize: 16 }} />
                    PUBLIC
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Event Title and Status */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    pb: 2,
                    borderBottom: '1px solid rgba(0,0,0,0.06)'
                  }}>
                    <Typography 
                      variant="h6" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#2C3E50',
                        fontSize: '1.25rem',
                      }}
                    >
                      {event.event_title}
                    </Typography>
                    {!event.is_public && (
                      <Lock sx={{ color: '#FF6B6B' }} />
                    )}
                  </Box>

                  {/* Creator information with enhanced styling */}
                  {event.creator && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      color: '#666'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontStyle: 'italic',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#666',
                          fontSize: '0.875rem'
                        }}
                      >
                        Created by: {event.creator.fullname}
                      </Typography>
                    </Box>
                  )}

                  {/* Event Details with enhanced styling */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Description */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'start', 
                      gap: 1,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      padding: 1.5,
                      borderRadius: 1
                    }}>
                      <Description sx={{ color: '#666', mt: 0.5 }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666',
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {event.description || 'No description available'}
                      </Typography>
                    </Box>
                    
                    {/* Date and Location with subtle backgrounds */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      padding: 1,
                      borderRadius: 1
                    }}>
                      <Event sx={{ color: '#666' }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {new Date(event.start_date).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      padding: 1,
                      borderRadius: 1
                    }}>
                      <LocationOn sx={{ color: '#666' }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Enhanced Card Actions */}
                <CardActions sx={{ 
                  p: 2, 
                  pt: 0,
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  justifyContent: 'flex-end'
                }}>
                  <Button
                    size="small"
                    startIcon={<ThumbUp />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(event.id);
                    }}
                    sx={{
                      color: '#4ECDC4',
                      fontWeight: 'medium',
                      '&:hover': {
                        backgroundColor: 'rgba(78,205,196,0.1)',
                      }
                    }}
                  >
                    {event.total_likes || 0} Likes
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default ViewEvents