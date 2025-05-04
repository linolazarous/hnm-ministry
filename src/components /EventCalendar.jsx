import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FaCalendarPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import './EventCalendar.css';

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    allDay: true,
    description: ''
  });

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/events');
        setEvents(response.data.map(event => ({
          ...event,
          start: event.start,
          end: event.end,
        })));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle date click (create new event)
  const handleDateClick = (arg) => {
    setFormData({
      title: '',
      start: arg.dateStr,
      end: arg.dateStr,
      allDay: arg.allDay,
      description: ''
    });
    setSelectedEvent(null);
    setShowModal(true);
  };

  // Handle event click (view/edit existing event)
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setFormData({
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      allDay: info.event.allDay,
      description: info.event.extendedProps?.description || ''
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save event (create or update)
  const handleSaveEvent = async () => {
    try {
      setLoading(true);
      
      if (selectedEvent) {
        // Update existing event
        const response = await api.put(`/events/${selectedEvent.id}`, formData);
        setEvents(events.map(event => 
          event.id === selectedEvent.id ? response.data : event
        ));
      } else {
        // Create new event
        const response = await api.post('/events', formData);
        setEvents([...events, response.data]);
      }
      
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      setLoading(true);
      await api.delete(`/events/${selectedEvent.id}`);
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  // Custom event content renderer
  const renderEventContent = (eventInfo) => (
    <div className="event-content">
      <div className="event-title">{eventInfo.event.title}</div>
      {eventInfo.event.extendedProps.description && (
        <div className="event-description">
          {eventInfo.event.extendedProps.description}
        </div>
      )}
    </div>
  );

  return (
    <div className="calendar-container">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {loading && !events.length ? (
        <div className="loading-overlay">
          <Spinner animation="border" />
          <span>Loading calendar events...</span>
        </div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          editable={true}
          selectable={true}
          nowIndicator={true}
          eventDisplay="block"
          height="auto"
          themeSystem="bootstrap5"
        />
      )}

      {/* Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent ? 'Edit Event' : 'Create New Event'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date/Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date/Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="allDay"
                label="All Day Event"
                checked={formData.allDay}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Event details"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {selectedEvent && (
            <Button 
              variant="danger" 
              onClick={handleDeleteEvent}
              disabled={loading}
            >
              <FaTrash /> Delete
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={handleSaveEvent}
            disabled={loading || !formData.title || !formData.start}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : selectedEvent ? (
              <><FaEdit /> Update</>
            ) : (
              <><FaCalendarPlus /> Create</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
