import express, { type Express, Router } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateGeminiResponse, configureGemini } from "./gemini";
import { WebSocketServer } from "ws";
import { z } from "zod";
import Stripe from "stripe";
import { 
  insertUserSchema, 
  insertConversationSchema, 
  insertMessageSchema,
  insertWorkoutSchema,
  insertProgressSchema
} from "@shared/schema";
import { handleFormCheckAnalysis } from "./services/vision-service";
import { handleSpeechToText, handleTextToSpeech } from "./services/speech-service";
import { registerFitnessTrackerRoutes } from "./services/fitness-trackers";
import { 
  handleRepCounting, 
  handleVoiceCommand, 
  handleVoiceResponse 
} from "./services/voice-coaching";
import { registerApiStatusRoutes } from "./services/api-status-service";
import { getAllApiStatus } from "./services/api-status-service";
import { registerSystemAuditRoutes } from "./services/system-audit";
import { registerRapidApiRoutes } from "./services/rapid-api-service";
import { registerUserProfileRoutes } from "./services/user-profile-service";
import billingStatusRoutes from "./routes/billing-status-routes";
import deploymentReadinessRoutes from "./routes/deployment-readiness-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Gemini configuration
  configureGemini();
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create API router
  const apiRouter = Router();
  app.use('/api', apiRouter);
  
  // Register fitness tracker routes
  registerFitnessTrackerRoutes(apiRouter);
  
  // User routes
  apiRouter.post("/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Authentication route (simplified for demo)
  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Update last active timestamp
      await storage.updateUser(user.id, { lastActive: new Date() });
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        name: user.name,
        language: user.language
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Conversation routes
  apiRouter.post("/conversations", async (req, res) => {
    try {
      const conversationData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(conversationData);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid conversation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });
  
  // Message route (replacing WebSocket functionality)
  apiRouter.post("/conversations/:conversationId/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const { content, userId } = req.body;
      
      if (isNaN(conversationId) || !content) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Store user message
      await storage.createMessage({
        conversationId,
        content,
        role: "user"
      });
      
      // Get conversation history
      const messages = await storage.getMessagesByConversationId(conversationId);
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Generate AI response
      const response = await generateGeminiResponse(formattedMessages);
      
      // Store AI response
      const assistantMessage = await storage.createMessage({
        conversationId,
        content: response,
        role: "assistant"
      });
      
      // Return both messages
      res.status(201).json({
        userMessage: {
          conversationId,
          content,
          role: "user",
          timestamp: new Date().toISOString()
        },
        assistantMessage
      });
    } catch (error) {
      console.error("Message API error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });
  
  apiRouter.get("/users/:userId/conversations", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const conversations = await storage.getConversationsByUserId(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });
  
  apiRouter.get("/conversations/:conversationId/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      
      if (isNaN(conversationId)) {
        return res.status(400).json({ message: "Invalid conversation ID" });
      }
      
      const messages = await storage.getMessagesByConversationId(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  // Workout routes
  apiRouter.post("/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create workout" });
    }
  });
  
  apiRouter.get("/users/:userId/workouts", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const workouts = await storage.getWorkoutsByUserId(userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });
  
  // Progress routes
  apiRouter.post("/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.createProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create progress entry" });
    }
  });
  
  apiRouter.get("/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const type = req.query.type as string | undefined;
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      let progress;
      if (type) {
        progress = await storage.getProgressByUserIdAndType(userId, type);
      } else {
        progress = await storage.getProgressByUserId(userId);
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress data" });
    }
  });
  
  // Google Cloud API integration routes
  
  // Form Check Analysis API
  apiRouter.post("/form-check", handleFormCheckAnalysis);
  
  // Speech-to-Text API
  apiRouter.post("/speech-to-text", handleSpeechToText);
  
  // Text-to-Speech API
  apiRouter.post("/text-to-speech", handleTextToSpeech);
  
  // Voice Coaching APIs
  apiRouter.post("/voice-coaching/rep-counting", handleRepCounting);
  apiRouter.post("/voice-coaching/command", handleVoiceCommand);
  apiRouter.post("/voice-coaching/response", handleVoiceResponse);
  
  // Registrar las rutas de estado de API de Google Cloud
  registerApiStatusRoutes(apiRouter);
  console.log("🔍 Google Cloud API Status routes registered successfully");
  
  // Registrar las rutas de auditoría del sistema
  registerSystemAuditRoutes(apiRouter);
  console.log("🔍 System Audit routes registered successfully");
  
  // Registrar las rutas de Rapid API
  registerRapidApiRoutes(apiRouter);
  
  // Register user profile routes
  registerUserProfileRoutes(apiRouter);
  console.log("👤 User Profile routes registered successfully");
  
  // Register billing status routes
  app.use(billingStatusRoutes);
  console.log("💰 Billing Status routes registered successfully");
  
  // Register deployment readiness routes
  app.use(deploymentReadinessRoutes);
  console.log("🚀 Deployment Readiness routes registered successfully");

  // Stripe payment integration
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("⚠️ Stripe payment integration not configured. Missing STRIPE_SECRET_KEY");
  } else {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil" as any,
    });

    // Create Payment Intent for one-time payments
    apiRouter.post("/create-payment-intent", async (req, res) => {
      try {
        const { amount, plan } = req.body;
        
        if (!amount || amount <= 0) {
          return res.status(400).json({ message: "Invalid amount" });
        }

        console.log(`Creating payment intent for ${amount} cents (${plan || 'no plan specified'})`);
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // Amount in cents
          currency: "usd",
          metadata: {
            plan: plan || "one-time",
          },
        });
        
        res.json({ 
          clientSecret: paymentIntent.client_secret,
          id: paymentIntent.id
        });
      } catch (error: any) {
        console.error("Stripe payment intent error:", error.message);
        res.status(500).json({ 
          message: "Error creating payment intent", 
          error: error.message 
        });
      }
    });

    // Create or retrieve a subscription
    apiRouter.post("/get-or-create-subscription", async (req, res) => {
      try {
        const { userId, plan } = req.body;
        
        if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
        }

        const user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // For simplicity, we'll start with a basic implementation
        // A real implementation would check if the user already has a subscription
        // and would handle more complex subscription logic
        
        let customerId = user.stripeCustomerId;
        
        // If no customer ID exists, create a new customer
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email || `user${userId}@example.com`,
            name: user.name || user.username,
            metadata: {
              userId: userId.toString()
            }
          });
          
          customerId = customer.id;
          
          // Update user with Stripe customer ID
          await storage.updateUser(userId, { 
            stripeCustomerId: customerId 
          });
        }
        
        // Set up the subscription
        // This is simplified - in a real app you'd have product/price IDs defined in Stripe
        const priceId = plan === "elite" ? "price_elite_monthly" : "price_pro_monthly";
        
        // Create the subscription
        try {
          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: priceId,
            }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
          });
          
          // Update user's subscription info
          await storage.updateUser(userId, {
            stripeSubscriptionId: subscription.id
          });
          
          // Send client secret back to the client
          res.json({
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret
          });
        } catch (err: any) {
          console.error("Stripe subscription error:", err.message);
          
          // For demo purposes, we'll create a payment intent instead if the subscription fails
          // (since we might not have real price IDs in Stripe)
          const amount = plan === "elite" ? 4999 : 1999;
          
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            customer: customerId,
            metadata: {
              plan: plan || "pro",
              userId: userId.toString()
            },
          });
          
          res.json({ 
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id
          });
        }
      } catch (error: any) {
        console.error("Stripe subscription error:", error.message);
        res.status(500).json({ 
          message: "Error creating subscription", 
          error: error.message 
        });
      }
    });

    // API endpoint to check subscription status
    apiRouter.get("/subscription/:userId", async (req, res) => {
      try {
        const userId = parseInt(req.params.userId);
        
        if (isNaN(userId)) {
          return res.status(400).json({ message: "Invalid user ID" });
        }
        
        const user = await storage.getUser(userId);
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        // Check if user has a subscription
        if (!user.stripeSubscriptionId) {
          return res.json({ 
            active: false,
            plan: "free",
            message: "No active subscription" 
          });
        }
        
        // Retrieve subscription from Stripe
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          
          return res.json({
            active: subscription.status === "active",
            plan: subscription.metadata.plan || "pro",
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString()
          });
        } catch (err) {
          // If subscription not found in Stripe
          return res.json({ 
            active: false,
            plan: "free",
            message: "Subscription not found in Stripe" 
          });
        }
      } catch (error: any) {
        console.error("Error checking subscription:", error.message);
        res.status(500).json({ 
          message: "Error checking subscription status", 
          error: error.message 
        });
      }
    });

    console.log("💳 Stripe payment routes registered successfully");
  }
  
  return httpServer;
}
