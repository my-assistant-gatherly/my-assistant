import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './CreateEvents.css'

function CreateEventsPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.id);

  const [eventData, setEventData] = useState({
    invitedUsers: [],
  });
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleCancel = (e) => {
    history.push('./events')
  }

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 1) {
      try {
        const response = await axios.get(`/api/user/search?query=${query}`);
        setUserSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching user suggestions:', error);
      }
    } else {
      setUserSuggestions([]);
    }
  };

  const handleSelectUser = (user) => {
    if (!eventData.invitedUsers.find((u) => u.id === user.id)) {
      setEventData({
        ...eventData,
        invitedUsers: [...eventData.invitedUsers, user],
      });
    }
    setSearchTerm('');
    setUserSuggestions([]);
  };

  const handleRemoveUser = (userId) => {
    setEventData({
      ...eventData,
      invitedUsers: eventData.invitedUsers.filter((user) => user.id !== userId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, start_date, end_date, start_time, end_time, duration, location, description, isPrivate, notes, tasks, invitedUsers } = eventData;

    if (!title || !start_date || !end_date || !start_time || !end_time || !location) {
      alert('Please fill in all required fields.');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await axios.post('/api/events', {
        user_id: userId,
        event_title: title,
        start_date,
        end_date,
        start_time: `${start_time}:00`,
        end_time,
        location,
        duration: duration || null,
        description,
        is_public: !isPrivate,
        notes: notes || '',
        tasks: tasks || '',
        invitedUsers: isPrivate ? invitedUsers : [],
      });

      dispatch({ type: 'SET_EVENT', payload: response.data });
      alert('Event Created Successfully 🎉');

      setEventData({
        invitedUsers: [],
      });

      history.push('/my-events');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create event.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <form className="CE_form" onSubmit={handleSubmit}>
      <div className="CE_container">
        <h1 className="CE_p">Create New Event 📅</h1>

        Event Title
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={eventData.title}
          onChange={handleChange}
          required
        />

        <div className="CE_row">
          <div>
            Start Date
            <input
              type="date"
              name="start_date"
              placeholder="Event Date"
              value={eventData.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            End Date
            <input
              type="date"
              name="end_date"
              placeholder="Event Date"
              value={eventData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="CE_row">
          <div>
            Start Time
            <input
              type="time"
              name="start_time"
              placeholder="Event Time"
              value={eventData.start_time}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            End Time
            <input
              type="time"
              name="end_time"
              placeholder="Event Time"
              value={eventData.end_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        Duration
        <input
          type="number"
          name="duration"
          placeholder="Event Duration in Hours (optional)"
          value={eventData.duration}
          onChange={handleChange}
          step="0.5"
          min="0"
        />

        Location
        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={eventData.location}
          onChange={handleChange}
          required
        />

        <br />

        Description<textarea
          name="description"
          placeholder="Enter Description Here"
          value={eventData.description}
          onChange={handleChange}
        />
        <br />
        Notes<textarea
          name="notes"
          placeholder="Add Notes Here"
          value={eventData.notes}
          onChange={handleChange}
        />
        <br />
        Tasks<textarea
          name="tasks"
          placeholder="Enter Tasks Here"
          value={eventData.tasks}
          onChange={handleChange}
        />
        <br />

        <div>
          <input
            type="radio"
            name="isPrivate"
            value={true}
            checked={eventData.isPrivate === true}
            onChange={() => setEventData({ ...eventData, isPrivate: true })}
          />
          <label>Private </label>

          <input
            type="radio"
            name="isPrivate"
            value={false}
            checked={eventData.isPrivate === false}
            onChange={() => setEventData({ ...eventData, isPrivate: false })}
          />
          <label>Public</label>

          {eventData.isPrivate && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              Be sure to add your own name below as an invited user to events marked private.
            </p>
          )}
        </div>

        {eventData.isPrivate && (
          <div>
            <input
              type="text"
              placeholder="Invite Users"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {userSuggestions.length > 0 && (
              <ul>
                {userSuggestions.map((user) => (
                  <li key={user.id} onClick={() => handleSelectUser(user)}>
                    {user.fullname}
                  </li>
                ))}
              </ul>
            )}
            <div>
              {eventData.invitedUsers.map((user) => (
                <div key={user.id}>
                  {user.fullname}
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <br />

        <button
          type="submit"
        > Save</button>

        <button onClick={handleCancel}
          type="submit"
        > Cancel</button>

      </div>
    </form>
  );
}

export default CreateEventsPage;
