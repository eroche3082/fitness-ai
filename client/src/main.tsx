import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./assets/custom-styles.css"; // Import the custom styles
import { QueryClient } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <App />
);
