// React Big Calendar does not handle timezones.
// It does support using your choice of libraries specifically built to help with timezones.
// In this example, I'm setting up "moment.js" as the "localizer" to deal with timezones.
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import { useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';

// This is some "default css" that they offer.
// You can override it to make it your own.
import "react-big-calendar/lib/css/react-big-calendar.css";


// This is the line that tells React Big Calendar to use Moment.js for timezone stuff.
const localizer = momentLocalizer(moment)

export default function BigCalendar() {

  const dispatch = useDispatch();
  const events = useSelector(store => store.eventsReducer);

  // console.log('what are the events in the reducer', events);

   // console.log('what the start time looks like', events.description);

    useEffect(() => {
        dispatch({ type: 'SET_EVENT'});
    }, []);

 // this will go into the events property
  const eventsList = events.map(event => ({
    id: event.id,
    title: event.event_title,
    start: moment(event.start_date).add(event.start_time, 'hours').toDate(),
    end: moment(event.end_date).add(event.end_time, 'hours').toDate(),
    description: events.description
    
  }));


//console.log('testing formatDate',formatDate(events.start_time));

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
      //defaultView="week"
      //defaultView="work_week"
      //defaultView="day"
      events={eventsList}
      style={{ height: "90vh"}}
     
    />

</>
  );

}