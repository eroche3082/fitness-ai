import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChatProvider } from "./contexts/ChatContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ChatProvider>
      <App />
    </ChatProvider>
  </QueryClientProvider>
);
