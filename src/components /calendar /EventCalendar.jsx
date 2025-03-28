import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../../services/api';

export default function EventCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data));
  }, []);

  const handleDateClick = (arg) => {
    const title = prompt('Event Title:');
    if (title) {
      api.post('/events', {
        title,
        start: arg.dateStr,
        allDay: arg.allDay
      }).then(res => setEvents([...events, res.data]));
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleDateClick}
    />
  );
}