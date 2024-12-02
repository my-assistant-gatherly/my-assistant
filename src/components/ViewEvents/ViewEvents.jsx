import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './ViewEvents.css';

function ViewEvents() {
  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
  }, [filter, user]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user data. Please log in.');
      console.error('Error fetching user:', err);
    }
  };

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

  const handleLike = async (eventId) => {
    try {
      // Update the UI optimistically
      setEvents(events.map(event => {
        if (event.id === eventId) {
          return { ...event, total_likes: (event.total_likes || 0) + 1 };
        }
        return event;
      }));

      // Make the API call to update the likes in the database
      await axios.put(`/api/events/${eventId}/like`);
    } catch (err) {
      console.error('Error updating likes:', err);
      // Revert the optimistic update if the API call fails
      fetchEvents();
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div className='view-events'>
      <h1 className='view-events-title'>Events</h1>
      <div className='view-events-buttons'>
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="invite-only">Invite Only</option>
        </select>
        <button onClick={() => history.push('/search-events')}>Search</button>
        <button onClick={() => history.push('/create-events')}>Create Event</button>
      </div>
      <div className='view-events-list'>
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className='view-events-list-item'>
              <h2>{event.event_title}</h2>
              <p>{event.description || 'No description available'}</p>
              <p>Date: {new Date(event.start_date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <button onClick={() => handleLike(event.id)}>
                {event.total_likes || 0} Likes
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewEvents