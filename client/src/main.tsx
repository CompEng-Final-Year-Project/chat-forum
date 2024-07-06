import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { Toaster } from "@/components/ui/toaster";
import { PostProvider } from "./contexts/PostContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PostProvider>
          <Toaster />
          <App />
        </PostProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
