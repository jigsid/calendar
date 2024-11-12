// src/Calendar.js
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import styles
import axios from "axios";
import TempEventForm from "./TempEventForm"; // Ensure this component is correctly implemented
import "./styles.css"; // Import your custom styles

const EventCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [notification, setNotification] = useState(null); // State for notification message
  const [notificationActive, setNotificationActive] = useState(true); // Flag to manage notification visibility

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(new Date(newDate)); // Ensure selected date is a new Date object
    setShowForm(true); // Show form when a date is clicked
  };

  const handleEventSaved = () => {
    fetchEvents(); // Refresh events after saving
    setShowForm(false); // Hide form after saving
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/events/${id}`);
      fetchEvents(); // Refresh events after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter((event) => {
    return (
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get upcoming events that match the selected date
  const upcomingEventsOnSelectedDate = filteredEvents.filter(
    (event) =>
      new Date(event.date).toLocaleDateString() ===
        selectedDate?.toLocaleDateString() && new Date(event.date) > new Date() // Ensure it's an upcoming event
  );

  // Check for upcoming events and schedule notifications
  useEffect(() => {
    const now = new Date();

    filteredEvents.forEach((event) => {
      const eventDateTime = new Date(event.date);

      if (eventDateTime <= now && notificationActive) {
        // Check if the event time has hit and notification is active
        setNotification({
          title: event.title,
          description: event.description,
          id: event.id,
        });
        setNotificationActive(true); // Ensure we can show notifications again if needed.
      }

      // Schedule future notifications
      if (eventDateTime > now) {
        const delay = eventDateTime - now;
        setTimeout(() => {
          if (notificationActive) {
            // Only show if no other notification is active
            setNotification({
              title: event.title,
              description: event.description,
              id: event.id,
            });
            setNotificationActive(true);
          }
        }, delay);
      }
    });

    return () => clearTimeout(); // Cleanup timeout on component unmount or re-render
  }, [filteredEvents]);

  // Handle snooze logic
  const handleSnooze = () => {
    setNotification(null); // Clear current notification immediately
    setNotificationActive(false); // Set flag to prevent showing again until a new event occurs

    // Optionally, you can add logic here to reschedule a snooze notification if desired.
    console.log("Snoozed for 5 minutes.");

    // Schedule a timeout to allow reshowing notifications after snooze duration if needed.
    setTimeout(() => {
      console.log("You can check for notifications again.");
      setNotificationActive(true);
    }, 5 * 60000); // Snooze for 5 minutes (300000 ms)
  };

  // Handle dismiss logic
  const handleDismiss = () => {
    setNotification(null); // Clear the notification immediately
    setNotificationActive(false); // Set flag to prevent showing again until a new event occurs
    console.log("Notification dismissed.");
  };

  return (
    <div className="calendar-container">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="calendar-notification-container">
        {/* Left Side - Calendar */}
        <div className="left-side">
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="calendar"
          />

          {/* Upcoming Events Section */}
          <h3>
            Upcoming Events on{" "}
            {selectedDate ? selectedDate.toLocaleDateString("en-GB") : ""}
          </h3>

          <ul className="upcoming-events">
            {upcomingEventsOnSelectedDate.map((event) => (
              <li key={event.id} className="upcoming-event-item">
                <strong>{event.title}</strong> - {event.description}
                <span> on {new Date(event.date).toLocaleString()}</span>
                {event.image && (
                  <img
                    src={`http://localhost:3001/uploads/${event.image}`}
                    alt="Event"
                    className="upcoming-event-image"
                  />
                )}
              </li>
            ))}

            {upcomingEventsOnSelectedDate.length === 0 && (
              <li>No upcoming events.</li>
            )}
          </ul>
        </div>

        {/* Middle - Title & Description Form */}
        <div className="middle-content">
          {showForm && (
            <TempEventForm
              date={selectedDate}
              onEventSaved={handleEventSaved}
            />
          )}
        </div>

        {/* Right Side - Notification Message Block */}
        <div className="right-side">
          {notification && (
            <div className="notification">
              <h4>{notification.title}</h4>
              <p>{notification.description}</p>
              <div className="notification-buttons">
                <button onClick={handleSnooze}>Snooze</button>
                <button onClick={handleDismiss}>Dismiss</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Events List Section */}
      <h3>
        Events on {selectedDate ? selectedDate.toLocaleDateString("en-GB") : ""}
      </h3>

      <ul className="event-list">
        {filteredEvents
          .filter(
            (event) =>
              new Date(event.date).toLocaleDateString() ===
              selectedDate?.toLocaleDateString()
          )
          .map((event) => (
            <li key={event.id} className="event-item">
              <strong>{event.title}</strong> - {event.description}
              {event.image && (
                <img
                  src={`http://localhost:3001/uploads/${event.image}`}
                  alt="Event"
                  className="event-image"
                />
              )}
              <button onClick={() => handleDeleteEvent(event.id)}>
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EventCalendar;
