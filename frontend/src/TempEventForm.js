// src/TempEventForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css"; // Import your custom styles

const TempEventForm = ({ date, onEventSaved }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState(""); // Combined date and time

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { title, date: eventDateTime, description }; // Use combined date and time

    try {
      await axios.post("http://localhost:3001/events", eventData);
      onEventSaved(); // Callback to refresh events list or close form
      setTitle(""); // Clear input fields after submission
      setDescription("");
      setEventDateTime(""); // Reset event date and time
      scheduleNotification(eventData); // Schedule notification for the event
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const scheduleNotification = (eventData) => {
    const eventDateTimeObj = new Date(eventData.date);
    const now = new Date();
    const delay = eventDateTimeObj - now;

    if (delay > 0) {
      setTimeout(() => {
        showNotification(eventData);
      }, delay);
    }
  };

  const showNotification = (eventData) => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("Event Reminder", {
        body: `Reminder: ${eventData.title} is scheduled for ${eventData.date}.`,
        icon: "icon.png", // Path to your icon
        actions: [
          { action: "snooze", title: "Snooze for 5 minutes" },
          { action: "dismiss", title: "Dismiss" },
        ],
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="form-input"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="form-textarea"
      />

      {/* Combined datetime-local input for selecting date and time */}
      <input
        type="datetime-local"
        value={eventDateTime}
        onChange={(e) => setEventDateTime(e.target.value)}
        required
        className="form-datetime"
      />

      <button type="submit" className="submit-button">
        Save Event
      </button>
    </form>
  );
};

export default TempEventForm;
