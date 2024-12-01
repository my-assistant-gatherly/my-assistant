// React Big Calendar does not handle timezones.
// It does support using your choice of libraries specifically built to help with timezones.
// In this example, I'm setting up "moment.js" as the "localizer" to deal with timezones.
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

// This is some "default css" that they offer.
// You can override it to make it your own.
import "react-big-calendar/lib/css/react-big-calendar.css";

// This is the line that tells React Big Calendar to use Moment.js for timezone stuff.
const localizer = momentLocalizer(moment)

export default function BigCalendar() {

  // I need some stuff to put on my calendar.
  // Details on what properties an event object supports: https://jquense.github.io/react-big-calendar/examples/index.html?path=/docs/props--events
  let myEventsList = [
    {
      start: moment().toDate(),
      end: moment()
        .add(1, "days")
        .toDate(),
      title: "Some title"
    }
  ];

  return (

    // Anywhere I want a calendar, I use the <Calendar> component.
    // I can pass it props to customize it.
    // Full list of props and what they do: https://jquense.github.io/react-big-calendar/examples/index.html?path=/docs/props-full-prop-list--page
   <form>
   <br />
    <Calendar
      localizer={localizer}
      defaultDate={new Date()}
      // You can change the default view, based on which of these options you choose:
      // defaultView="agenda"
      defaultView="month"
      // defaultView="week"
      // defaultView="work_week"
      // defaultView="day"
      events={myEventsList}
      style={{ height: "100vh" }}
    />
    </form>
  );

}
