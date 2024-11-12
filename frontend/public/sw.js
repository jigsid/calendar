/* global clients */

// Listen for push notifications
this.addEventListener("push", function (event) {
  const data = event.data.json(); // Get the data sent from the server
  const options = {
    body: data.body,
    icon: "icon.png", // Path to your icon
    actions: [
      { action: "snooze", title: "Snooze for 5 minutes" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    this.registration.showNotification(data.title, options) // Use 'this' instead of 'self'
  );
});

// Listen for notification clicks
this.addEventListener("notificationclick", function (event) {
  event.notification.close(); // Close the notification immediately

  if (event.action === "snooze") {
    const snoozeTime = new Date(Date.now() + 5 * 60000); // Snooze for 5 minutes

    // Schedule a new notification after snoozing
    setTimeout(() => {
      event.waitUntil(
        this.registration.showNotification("Snoozed Notification", {
          body: `You snoozed your event until ${snoozeTime.toLocaleTimeString()}.`,
          icon: "icon.png",
          actions: [
            { action: "snooze", title: "Snooze for 5 minutes" },
            { action: "dismiss", title: "Dismiss" },
          ],
        })
      );
    }, 5 * 60000); // Snooze duration in milliseconds (5 minutes)
  } else if (event.action === "dismiss") {
    // Simply dismiss the notification; no further action needed.
    console.log("Notification dismissed.");
    // No need to do anything else here as the notification is already closed.
  } else {
    // Handle default click action (e.g., open a specific URL)
    clients.openWindow("/"); // Change this to your desired URL
  }
});
