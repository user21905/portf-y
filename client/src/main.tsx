import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { ToastHost } from "@/components/ui/ToastHost";
import "./lib/firebase";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ToastHost />
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
