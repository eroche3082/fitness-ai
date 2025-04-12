import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { configureGemini } from "./gemini";
import { initializeGoogleCloudServices } from "./google-cloud-config";
import { initializeGoogleCloudApis } from "./services/google-cloud-integration";

// Configure Google APIs
configureGemini();

// Initialize Google Cloud services (non-blocking)
initializeGoogleCloudServices()
  .then(() => console.log("Google Cloud services initialized successfully"))
  .catch(err => console.warn("Google Cloud services initialization failed, some features may be limited:", err));

// Initialize our extended Google Cloud APIs for Fitness AI
initializeGoogleCloudApis()
  .then(success => {
    if (success) {
      console.log("✅ Google Cloud APIs for Fitness AI initialized successfully");
      console.log("🚀 The following APIs are active: Generative AI, Vision, Speech, Text-to-Speech, Translation, Language, Video Intelligence, Firestore, Vertex AI, Maps, Dialogflow, Storage, DLP, Monitoring, Secret Manager");
    } else {
      console.warn("⚠️ Some Google Cloud APIs for Fitness AI could not be initialized");
    }
  })
  .catch(err => console.error("❌ Failed to initialize Google Cloud APIs for Fitness AI:", err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
