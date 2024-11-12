// src/EventList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import EventForm from "./TempEventForm";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const fetchEvents = async () => {
    const response = await axios.get("http://localhost:3001/events");
    setEvents(response.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/events/${id}`);
    fetchEvents(); // Refresh events list after deletion
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> - {event.date}
            <button onClick={() => setEditingEvent(event)}>Edit</button>
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{editingEvent ? "Edit" : "Create"} Event</h3>
      <EventForm
        eventToEdit={editingEvent}
        onEventSaved={() => {
          fetchEvents();
          setEditingEvent(null);
        }}
      />
    </div>
  );
};

export default EventList;
