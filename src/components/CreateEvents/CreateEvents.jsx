import React from 'react';
import { useState } from 'react';

// This is one of our simplest components
// It doesn't have local state
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is

function CreateEventsPage() {

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    description: "",
    notes: "",
    tasks: "",
    isPrivate: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleToggle = (isPrivate) => {
    setEventData({ ...eventData, isPrivate });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data:", eventData);
    // You can send `formData` to your backend here
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <p>Create New Event</p>

        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={eventData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="date"
          placeholder="Event Date"
          value={eventData.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="time"
          placeholder="Event Time"
          value={eventData.time}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="duration"
          placeholder="Event Duration"
          value={eventData.duration}
          onChange={handleChange}
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

        <button
          type="button"
          onClick={() => handleToggle(true)}
        > Public</button>

        <button
          type="button"
          onClick={() => handleToggle(false)}
        > Private</button>

        <br />

        <button
          type="submit"
        > Save</button>

      </div>
    </form>
  );
}

export default CreateEventsPage;
