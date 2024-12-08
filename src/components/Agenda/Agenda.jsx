// React Big Calendar does not handle timezones.
// It does support using your choice of libraries specifically built to help with timezones.
// In this example, I'm setting up "moment.js" as the "localizer" to deal with timezones.
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment';
import { useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import axios from 'axios';

// This is some "default css" that they offer.
// You can override it to make it your own.
import "react-big-calendar/lib/css/react-big-calendar.css";
//import './BigCalendar.css';

// This is the line that tells React Big Calendar to use Moment.js for timezone stuff.
const localizer = momentLocalizer(moment)

export default function Agenda() {
  const [myEventsData, setMyEventsData] = useState([]);
  const [formattedEvents, setFormattedEvents] = useState([]);
  const [view, setView] = useState('month');

  const formatEventData = (eventData) => {
    return eventData.map(event => {
      const startDateTime = moment(event.start_date).add(event.start_time, 'hours');
      const endDateTime = moment(event.end_date).add(event.end_time, 'hours');
      
      return {
        title: event.event_title,
        start: startDateTime.toDate(),
        end: endDateTime.toDate(),
        allDay: false, // Setting this to false ensures time is displayed
        desc: `${startDateTime.format('h:mm A')} - ${endDateTime.format('h:mm A')}` // Adding formatted time to description
      };
    });
  };

  const userId = useSelector(state => state.user.id);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/events/${userId}`);
        setMyEventsData(response.data);
        const formatted = formatEventData(response.data);
        setFormattedEvents(formatted);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchEvents();
  }, [userId]);

//   const customStyles = {
//     height: '100%',
//     backgroundColor: '#ffffff',
//     borderRadius: '10px',
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  
//   };

  const formats = {
    agendaTimeFormat: 'h:mm A', // Format for the time display
    agendaTimeRangeFormat: ({ start, end }) => {
      return `${moment(start).format('h:mm A')} - ${moment(end).format('h:mm A')}`;
    }
  };

  function CustomToolbar(toolbar) {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={goToBack}>&lt;</button>
          <button type="button" onClick={goToCurrent}>Today</button>
          <button type="button" onClick={goToNext}>&gt;</button>
        </span>
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <span className="rbc-btn-group"></span>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <div className="view-toggle">
          {/* <button 
            className={`view-button ${view === 'month' ? 'active' : ''}`}
            onClick={() => setView('month')}
          >
            Month
          </button>
        
          <button 
            className={`view-button ${view === 'day' ? 'active' : ''}`}
            onClick={() => setView('day')}
          >
            Day
          </button>

          <button 
            className={`view-button ${view === 'week' ? 'active' : ''}`}
            onClick={() => setView('week')}
          >
            Week
          </button> */}

          <button 
            className={`view-button ${view === 'agenda' ? 'active' : ''}`}
            onClick={() => setView('agenda')}
          >
            Agenda
          </button>

        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={formattedEvents}
        defaultDate={new Date()}
        view={view}
        onView={setView}
        views={[ 'agenda']}
        style={
        {height: 500,
          width: 600}
         }
        toolbar={true}
        components={{
          toolbar: CustomToolbar
        }}
        formats={formats}
        popup
        selectable
        eventPropGetter={(event) => ({
          className: 'calendar-event',
        })}
        //style={{ height: 500, width: 700 }}
      />
    </div>
  );
}