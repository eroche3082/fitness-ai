import { Request, Response } from 'express';

// Simulated in-memory storage for admin sessions
interface AdminSession {
  sessionId: string;
  createdAt: number;
  authenticated: boolean;
  expiresAt: number;
}

// In a production environment, this would be stored in a database
const adminSessions = new Map<string, AdminSession>();

// Time constants
const SESSION_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// Only one admin account exists - this would be moved to env vars and database in production
const ADMIN_FACE_HASH = 'la-capitana-biometric-hash'; // This is a placeholder

// Create a new QR session
export const createSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }
    
    // Create a new session
    const now = Date.now();
    const session: AdminSession = {
      sessionId,
      createdAt: now,
      authenticated: false,
      expiresAt: now + SESSION_EXPIRY_MS
    };
    
    // Save to in-memory storage
    adminSessions.set(sessionId, session);
    
    // Clean up expired sessions
    cleanupExpiredSessions();
    
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error creating admin session:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Check if a session is authenticated
export const checkSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid session ID is required' });
    }
    
    const session = adminSessions.get(sessionId);
    
    // Session doesn't exist or has expired
    if (!session || session.expiresAt < Date.now()) {
      return res.status(404).json({ success: false, authenticated: false, message: 'Session not found or expired' });
    }
    
    return res.json({ success: true, authenticated: session.authenticated });
  } catch (error) {
    console.error('Error checking admin session:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Handle facial authentication
export const faceAuth = async (req: Request, res: Response) => {
  try {
    const { sessionId, faceImage } = req.body;
    
    if (!sessionId || !faceImage) {
      return res.status(400).json({ success: false, message: 'Session ID and face image are required' });
    }
    
    const session = adminSessions.get(sessionId);
    
    // Session doesn't exist or has expired
    if (!session || session.expiresAt < Date.now()) {
      return res.status(404).json({ success: false, message: 'Session not found or expired' });
    }
    
    // In a real implementation, we would perform facial recognition here
    // For demo purposes, we'll mock a successful authentication
    const isCapitana = true; // Placeholder for actual facial recognition
    
    if (!isCapitana) {
      return res.status(403).json({ success: false, message: 'Facial authentication failed. Unauthorized access attempt.' });
    }
    
    return res.json({ success: true, message: 'Facial authentication successful' });
  } catch (error) {
    console.error('Error during facial authentication:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Authenticate a session after successful face recognition
export const authenticateSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }
    
    const session = adminSessions.get(sessionId);
    
    // Session doesn't exist or has expired
    if (!session || session.expiresAt < Date.now()) {
      return res.status(404).json({ success: false, message: 'Session not found or expired' });
    }
    
    // Update session to authenticated
    session.authenticated = true;
    adminSessions.set(sessionId, session);
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error authenticating session:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Cancel a session
export const cancelSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }
    
    // Remove the session
    adminSessions.delete(sessionId);
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling session:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Logout from super admin
export const logout = async (req: Request, res: Response) => {
  // In a real implementation with proper auth, we would invalidate the admin's token here
  return res.json({ success: true });
};

// Utility function to clean up expired sessions
function cleanupExpiredSessions() {
  const now = Date.now();
  
  // Convert to array for compatibility with all TypeScript targets
  Array.from(adminSessions.entries()).forEach(([sessionId, session]) => {
    if (session.expiresAt < now) {
      adminSessions.delete(sessionId);
    }
  });
}