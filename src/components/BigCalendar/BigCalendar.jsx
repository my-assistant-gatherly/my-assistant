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

    console.log('what are the events in the reducer', events);

   // console.log('what the start time looks like', events.description);

    useEffect(() => {
        dispatch({ type: 'FETCH_EVENTS'});

       // console.log('dispatch',  dispatch({ type: 'FETCH_EVENTS'}))
    }, []);

  // I need some stuff to put on my calendar.
  // Details on what properties an event object supports: https://jquense.github.io/react-big-calendar/examples/index.html?path=/docs/props--events
  // let myEventsList = [
  //   {
  //     start: moment().toDate(),
  //     end: moment()
  //       .add(1, "days")
  //       .toDate(),
  //     title: "blank"
  //   }
  // ];


  const test = events.map(event => ({
    id: event.id,
    title: event.event_title,
    start: moment(event.start_date).add(event.start_time, 'hours').toDate(),
    end: moment(event.end_date).add(event.end_time, 'hours').toDate(),
    description: events.description
    
  }));

  console.log('test function for events property', test);
  //console.log('moment', moment(event.date).toDate());



//console.log('testing formatDate',formatDate(events.start_time));

  return (

    // Anywhere I want a calendar, I use the <Calendar> component.
    // I can pass it props to customize it.
    // Full list of props and what they do: https://jquense.github.io/react-big-calendar/examples/index.html?path=/docs/props-full-prop-list--page
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
      defaultDate={new Date(2024, 11, 11)}
      defaultView="month"
      //defaultView="week"
      // defaultView="work_week"
      // defaultView="day"
      events={test}
      style={{ height: "90vh"}}
      // eventPropGetter={(event) => ({
      //   style: {
      //     backgroundColor: event.color || '#c590d1',
      //     borderRadius: '0px',
      //     opacity: 0.8,
      //     color: 'white',
      //     border: '0px',
      //     display: 'block'
      //   }
      // })}
    />


{/* {events.map((events)=>
<li key={events.id}>
{events.event_title} {events.start_time}
</li>
)} */}

</>
  );

}
