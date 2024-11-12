// src/index.js or src/App.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
};

registerServiceWorker();

ReactDOM.render(<App />, document.getElementById("root"));
