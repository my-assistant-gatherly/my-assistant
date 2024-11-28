import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';


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

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Data:", eventData);
    alert("Your Event Created Successfully 🎉")
    setEventData({
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

    history.push('/my-events')
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
            value="true"
            checked={eventData.isPrivate === true}
            onChange={() => setEventData({ ...eventData, isPrivate: true })}
          />
          <label>Private</label>

          <input
            type="radio"
            name="isPrivate"
            value="false"
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
