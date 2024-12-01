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
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
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
    const { title, start_date, end_date, start_time, end_time, duration, location, description, isPrivate, notes, tasks } = eventData;

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
      });

      dispatch({ type: 'SET_EVENT', payload: response.data });
      alert('Event Created Successfully 🎉');

      setEventData({
        title: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
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
        Start Date
        <input
          type="date"
          name="start_date"
          placeholder="Event Date"
          value={eventData.start_date}
          onChange={handleChange}
          required
        />
        End Date
        <input
          type="date"
          name="end_date"
          placeholder="Event Date"
          value={eventData.end_date}
          onChange={handleChange}
          required
        />
        Start Time
        <input
          type="time"
          name="start_time"
          placeholder="Event Time"
          value={eventData.start_time}
          onChange={handleChange}
          required
        />
        End Time
        <input
          type="time"
          name="end_time"
          placeholder="Event Time"
          value={eventData.end_time}
          onChange={handleChange}
          required
        />

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
