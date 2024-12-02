import React from 'react'
import { useHistory } from 'react-router-dom';
import './ViewEvents.css';

function ViewEvents() {
  const history = useHistory();
  return (
    <div className='view-events'>
     <h1 className='view-events-title'>Events</h1>
     <div className='view-events-buttons'>
     <select>
      <option value="all">All</option>
      <option value="invite-only">Invite Only</option>
     </select>
     <button onClick={() => history.push('/search-events')}>Search</button>
     <button onClick={() => history.push('/create-events')}>Create Event</button>
     </div>
     <div className='view-events-list'>
      <div className='view-events-list-item'>
        <h2>Event Name</h2>
        <p>Event Description</p>
        <p>Event Date</p>
        <button>Likes</button>
      </div>
     </div>
    </div>
  )
}

export default ViewEvents