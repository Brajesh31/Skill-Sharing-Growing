import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./assets/scss/main.scss";
import { NotificationProvider } from "./components/Notification/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(

  <AuthProvider>
    <NotificationProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </NotificationProvider>
  </AuthProvider>
);

reportWebVitals();
