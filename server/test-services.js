// Entry point for testing Google Cloud services

// Set the Google API Key from the configuration code
// This key is used for various Google Cloud services like
// Text-to-Speech, Speech-to-Text, Vision API, etc.
process.env.GOOGLE_API_KEY = "AIzaSyA--rn_uJjZtyU9kGpIWDpBa-obvtPrC24";

// Import and execute the service initialization test
import './tests/service-initialization-test.js';