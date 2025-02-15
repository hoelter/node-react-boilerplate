import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@client/components/App";
import "@client/styles/reset.css";
import "@client/styles/app.css";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
