// React Big Calendar does not handle timezones.
// It does support using your choice of libraries specifically built to help with timezones.
// In this example, I'm setting up "moment.js" as the "localizer" to deal with timezones.
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import { useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import axios from 'axios';

// This is some "default css" that they offer.
// You can override it to make it your own.
import "react-big-calendar/lib/css/react-big-calendar.css";


// This is the line that tells React Big Calendar to use Moment.js for timezone stuff.
const localizer = momentLocalizer(moment)

export default function BigCalendar() {

  const [myEventsData, setMyEventsData] = useState([]);
  const [formattedEvents, setFormattedEvents] = useState([]);

  const formatEventData = (eventData) => {
    return eventData.map(event => ({
      title: event.event_title,
      start: moment(event.start_date).add(event.start_time, 'hours').toDate(),
      end: moment(event.end_date).add(event.end_time, 'hours').toDate(),
      // Add any other properties needed by the Calendar component
    }));
  };


  const userId = useSelector(state => state.user.id);

  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/api/events/${userId}`);
        console.log('where response is big calendar', response.data);
        setMyEventsData(response.data);
        const formatted = formatEventData(response.data);
        setFormattedEvents(formatted);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
  
    fetchEvents();
  }, [userId]);


  return (

   <>
   <br/>
   <br/>
   <br/>
   <br/>
   <br/>
   <br/>
    <Calendar
      localizer={localizer}
      // You can change the default view, based on which of these options you choose:
      // defaultView="agenda"
      defaultDate={new Date(2024, 11, 11)} // default to december. if you want current time, do new Data()
      defaultView="month"
      events={formattedEvents}
      style={{ height: "90vh"}}
     
    />

</>
  );

}

 // console.log('what are the events in the reducer', events);

   // console.log('what the start time looks like', events.description);

    // useEffect(() => {
    //     dispatch({ type: 'SET_EVENT'});
    // }, []);

 // this will go into the events property
  // const eventsList = events.map(event => ({
  //   id: event.id,
  //   title: event.event_title,
  //   start: moment(event.start_date).add(event.start_time, 'hours').toDate(),
  //   end: moment(event.end_date).add(event.end_time, 'hours').toDate(),
  //   description: events.description
    
  // }));


//console.log('testing formatDate',formatDate(events.start_time));