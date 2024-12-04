import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  useTheme,
  Avatar,
  Divider,
  Chip,
  Fade
} from '@mui/material';
import { 
  Event as EventIcon,
  Notifications as NotificationsIcon,
  Today as TodayIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  Place as PlaceIcon,
  CalendarMonth as CalendarIcon,
  AccessTimeFilled as DurationIcon
} from '@mui/icons-material';

function HomePage() {
  // Theme and state management
  const theme = useTheme();
  // State variables
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch all data when user is available
  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // Helper function to fetch all data
  const fetchData = async () => {
    try {
      await Promise.all([
        fetchUpcomingEvents(),
        fetchReminders(),
        fetchAgenda()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Function to fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user data. Please log in.');
      console.error('Error fetching user:', err);
    }
  };

  // Function to fetch upcoming events
  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get('/api/events/upcoming');
      setUpcomingEvents(response.data);
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
    }
  };

  // Function to fetch reminders
  const fetchReminders = async () => {
    try {
      const response = await axios.get('/api/events/reminders');
      setReminders(response.data);
    } catch (err) {
      console.error('Error fetching reminders:', err);
    }
  };

  // Function to fetch agenda
  const fetchAgenda = async () => {
    try {
      const response = await axios.get('/api/events/agenda');
      setAgenda(response.data);
    } catch (err) {
      console.error('Error fetching agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert 
          severity="error"
          variant="outlined"
          sx={{ '.MuiAlert-message': { fontSize: '1.1rem' } }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Render authentication required state
  if (!user) {
    return (
      <Fade in>
        <Container sx={{ mt: 10, textAlign: 'center' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              backgroundColor: theme.palette.grey[50],
              border: `1px solid ${theme.palette.grey[200]}`
            }}
          >
            <CalendarIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
            <Alert 
              severity="info" 
              sx={{ 
                backgroundColor: 'transparent',
                '.MuiAlert-message': { fontSize: '1.1rem' }
              }}
            >
              Please log in to view your personalized dashboard.
            </Alert>
          </Paper>
        </Container>
      </Fade>
    );
  }

  // Main render
  return (
    <Fade in>
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              color: 'purple',
              mb: 1
            }}
          >
            Welcome back, {user.fullname}!
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 400,
              mt:5
            }}
          >
            Here's what's coming up on your schedule
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Upcoming Events Section */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontWeight: 600
                }}
              >
                <EventIcon color="primary" />
                Upcoming Events
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <Grid item xs={12} md={4} key={event.id}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.grey[200]}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: theme.shadows[4],
                          transform: 'translateY(-4px)',
                          transition: 'all 0.3s ease-in-out'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Title Section */}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 2,
                            lineHeight: 1.3
                          }}
                        >
                          {event.title}
                        </Typography>

                        {/* Date and Time Section */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CalendarIcon 
                              fontSize="small" 
                              sx={{ color: theme.palette.primary.main }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                fontWeight: 500
                              }}
                            >
                              {formatDate(event.date)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <TimeIcon 
                              fontSize="small" 
                              sx={{ color: theme.palette.primary.main }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                fontWeight: 500
                              }}
                            >
                              {formatTime(event.time)}
                            </Typography>
                          </Box>

                          {event.duration && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <DurationIcon 
                                fontSize="small" 
                                sx={{ color: theme.palette.primary.main }}
                              />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: theme.palette.text.secondary,
                                  fontWeight: 500
                                }}
                              >
                                Duration: {event.duration}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Location Section */}
                        {event.location && (
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              gap: 1, 
                              mb: 2,
                              backgroundColor: theme.palette.grey[50],
                              p: 1.5,
                              borderRadius: 1
                            }}
                          >
                            <PlaceIcon 
                              fontSize="small" 
                              sx={{ 
                                color: theme.palette.primary.main,
                                mt: 0.3
                              }}
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: theme.palette.text.secondary,
                                fontWeight: 500,
                                lineHeight: 1.4
                              }}
                            >
                              {event.location}
                            </Typography>
                          </Box>
                        )}

                        {/* Description Section */}
                        {event.description && (
                          <Box sx={{ mt: 'auto' }}>
                            <Divider sx={{ mb: 2 }} />
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                gap: 1
                              }}
                            >
                              <DescriptionIcon 
                                fontSize="small" 
                                sx={{ 
                                  color: theme.palette.primary.main,
                                  mt: 0.3
                                }}
                              />
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: theme.palette.text.secondary,
                                  lineHeight: 1.6
                                }}
                              >
                                {event.description}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      backgroundColor: theme.palette.grey[50],
                      border: `1px solid ${theme.palette.grey[200]}`,
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No upcoming events scheduled
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Reminders Section */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${theme.palette.grey[200]}`
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontWeight: 600,
                  mb: 3
                }}
              >
                <NotificationsIcon color="primary" />
                Reminders
              </Typography>
              <List sx={{ p: 0 }}>
                {reminders && reminders.length > 0 ? (
                  reminders.map((reminder, index) => (
                    <React.Fragment key={reminder.id}>
                      <ListItem 
                        sx={{ 
                          px: 0,
                          '&:hover': {
                            backgroundColor: theme.palette.grey[50]
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Avatar 
                            sx={{ 
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.main,
                              width: 32,
                              height: 32
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={reminder.text}
                          primaryTypographyProps={{
                            sx: { 
                              fontWeight: 500,
                              color: theme.palette.text.primary
                            }
                          }}
                        />
                      </ListItem>
                      {index < reminders.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="No reminders"
                      primaryTypographyProps={{
                        sx: { color: theme.palette.text.secondary }
                      }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Agenda Section */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3,
                height: '100%',
                borderRadius: 2,
                border: `1px solid ${theme.palette.grey[200]}`
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontWeight: 600,
                  mb: 3
                }}
              >
                <TodayIcon color="primary" />
                Today's Agenda
              </Typography>
              <List sx={{ p: 0 }}>
                {agenda && agenda.length > 0 ? (
                  agenda.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem 
                        sx={{ 
                          px: 0,
                          '&:hover': {
                            backgroundColor: theme.palette.grey[50]
                          }
                        }}
                      >
                        <ListItemIcon>
                          <Chip
                            label={formatTime(item.time)}
                            size="small"
                            sx={{ 
                              backgroundColor: theme.palette.primary.light,
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                              minWidth: 80
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.text}
                          primaryTypographyProps={{
                            sx: { 
                              fontWeight: 500,
                              color: theme.palette.text.primary
                            }
                          }}
                        />
                      </ListItem>
                      {index < agenda.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="No agenda items for today"
                      primaryTypographyProps={{
                        sx: { color: theme.palette.text.secondary }
                      }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}

export default HomePage;
