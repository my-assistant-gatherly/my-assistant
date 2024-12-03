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
} from '@mui/icons-material';

function EventDetails() {
  const { id } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events/details/${id}`);
      setEvent(response.data);
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
    <Container maxWidth="lg" sx={{ py: 4, mt: 7 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => history.goBack()}
        sx={{ mb: 3 }}
      >
        Back to Events
      </Button>

      {/* Main content */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header section */}
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
          {event.event_title}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Event details grid */}
        <Grid container spacing={3}>
          {/* Description */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
              <Description sx={{ mr: 2, mt: 0.5 }} color="action" />
              <Typography variant="body1">
                {event.description || 'No description available'}
              </Typography>
            </Box>
          </Grid>

          {/* Dates */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EventIcon sx={{ mr: 2 }} color="action" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                <Typography variant="body1">
                  {new Date(event.start_date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            {event.end_date && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ mr: 2 }} color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                  <Typography variant="body1">
                    {new Date(event.end_date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </Grid>

          {/* Times */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule sx={{ mr: 2 }} color="action" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Start Time</Typography>
                <Typography variant="body1">{event.start_time}</Typography>
              </Box>
            </Box>
            {event.end_time && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 2 }} color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">End Time</Typography>
                  <Typography variant="body1">{event.end_time}</Typography>
                </Box>
              </Box>
            )}
          </Grid>

          {/* Duration */}
          {event.duration && (
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Timer sx={{ mr: 2 }} color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1">{event.duration}</Typography>
                </Box>
              </Box>
            </Grid>
          )}

          {/* Location */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 2 }} color="action" />
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography variant="body1">{event.location}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Tasks Section */}
        {event.tasks && event.tasks.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} /> Tasks
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body1" paragraph>
                  {event.tasks.join('\n')}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {/* Notes Section */}
        {event.notes && event.notes.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Note sx={{ mr: 1 }} /> Notes
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body1" paragraph>
                  {event.notes.join('\n')}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        <Divider sx={{ my: 3 }} />
      </Paper>
    </Container>
  );
}

export default EventDetails;
