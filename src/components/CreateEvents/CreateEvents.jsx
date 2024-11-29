import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function CreateEventsPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.id);

  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    description: '',
    isPrivate: true,
    notes: '',
    tasks: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, date, time, duration, location, description, isPrivate, notes, tasks } = eventData;

    if (!title || !date || !time || !location) {
      alert('Please fill in all required fields.');
      return;
    }

    const durationValue = parseFloat(duration);
    if (isNaN(durationValue) || durationValue <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await axios.post('/api/events', {
        user_id: userId,
        event_title: title,
        date,
        start_time: `${time}:00`,
        location,
        duration: durationValue,
        description,
        is_public: !isPrivate,
        notes: notes || '',
        tasks: tasks || '',
      });

      dispatch({ type: 'ADD_EVENT', payload: response.data });
      alert('Event Created Successfully 🎉');

      setEventData({
        title: '',
        date: '',
        time: '',
        location: '',
        duration: '',
        description: '',
        isPrivate: true,
        notes: '',
        tasks: '',
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
        <p className="CE_p">Create New Event</p>

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={eventData.title}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          placeholder="Event Date"
          value={eventData.date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="time"
          placeholder="Event Time"
          value={eventData.time}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="duration"
          placeholder="Event Duration (Hours)"
          value={eventData.duration}
          onChange={handleChange}
          step="0.5"
          min="0"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={eventData.location}
          onChange={handleChange}
          required
        />

        <br />

        <textarea
          name="description"
          placeholder="Description"
          value={eventData.description}
          onChange={handleChange}
        />
        <br />
        <textarea
          name="notes"
          placeholder="Notes"
          value={eventData.notes}
          onChange={handleChange}
        />
        <br />
        <textarea
          name="tasks"
          placeholder="Tasks"
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
          <label>Private</label>

          <input
            type="radio"
            name="isPrivate"
            value={false}
            checked={eventData.isPrivate === false}
            onChange={() => setEventData({ ...eventData, isPrivate: false })}
          />
          <label>Public</label>
        </div>

        <br />

        <button
          type="submit"
        > Save</button>

      </div>
    </form>
  );
}

export default CreateEventsPage;
