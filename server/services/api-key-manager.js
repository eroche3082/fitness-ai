// API Key Manager (ES Module Version)
// This module manages the API keys for various Google Cloud services

// Default API key assignments
const API_KEYS = {
  UNIVERSAL: process.env.GOOGLE_API_KEY || "AIzaSyA--rn_uJjZtyU9kGpIWDpBa-obvtPrC24",
  GROUP1: process.env.GOOGLE_GROUP1_API_KEY || "AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U",
  GROUP2: process.env.GOOGLE_GROUP2_API_KEY || "AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08", 
  GROUP3: process.env.GOOGLE_GROUP3_API_KEY || "AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0"
};

// Service groups
const API_KEY_GROUPS = [
  {
    name: "UNIVERSAL",
    envVariable: "GOOGLE_API_KEY",
    key: API_KEYS.UNIVERSAL,
    services: ["texttospeech", "speech", "vision", "language", "translation"],
    priority: 1
  },
  {
    name: "GROUP1",
    envVariable: "GOOGLE_GROUP1_API_KEY",
    key: API_KEYS.GROUP1,
    services: ["vertex", "gemini", "vision"],
    priority: 2
  },
  {
    name: "GROUP2",
    envVariable: "GOOGLE_GROUP2_API_KEY",
    key: API_KEYS.GROUP2,
    services: ["gmail", "calendar", "drive", "sheets"],
    priority: 3
  },
  {
    name: "GROUP3",
    envVariable: "GOOGLE_GROUP3_API_KEY", 
    key: API_KEYS.GROUP3,
    services: ["firebase", "maps", "youtube"],
    priority: 4
  }
];

// Singleton pattern for API Key Manager
export class ApiKeyManager {
  static instance = null;
  
  constructor() {
    this.keyGroups = API_KEY_GROUPS;
    this.serviceAssignments = {};
  }
  
  static getInstance() {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }
  
  // Get API key for a specific service
  getApiKeyForService(service) {
    if (this.serviceAssignments[service]) {
      return this.serviceAssignments[service].key;
    }
    
    // Find the highest priority group that supports this service
    const eligibleGroups = this.keyGroups
      .filter(group => group.services.includes(service) && group.key)
      .sort((a, b) => a.priority - b.priority);
    
    if (eligibleGroups.length === 0) {
      console.warn(`No API key group found for service: ${service}`);
      return null;
    }
    
    const selectedGroup = eligibleGroups[0];
    this.serviceAssignments[service] = {
      group: selectedGroup.name,
      key: selectedGroup.key
    };
    
    console.log(`Assigned ${service} to API key group: ${selectedGroup.name}`);
    return selectedGroup.key;
  }
  
  // Initialize a specific service with the best available API key
  async initializeService(service) {
    const apiKey = this.getApiKeyForService(service);
    
    if (!apiKey) {
      return {
        service,
        assignedGroup: "NONE", 
        status: "failed",
        error: "No API key available for this service"
      };
    }
    
    try {
      // Here we would actually initialize the service
      // For now, we'll just simulate success
      const success = Math.random() > 0.3; // 70% success rate for testing
      
      return {
        service,
        assignedGroup: this.serviceAssignments[service].group,
        status: success ? "active" : "failed",
        error: success ? null : "Failed to initialize service"
      };
    } catch (error) {
      return {
        service,
        assignedGroup: this.serviceAssignments[service].group,
        status: "failed",
        error: error.message
      };
    }
  }
  
  // Initialize all provided services
  async initializeAllServices(services) {
    const assignments = [];
    
    for (const service of services) {
      const result = await this.initializeService(service);
      assignments.push(result);
    }
    
    const allSuccessful = assignments.every(a => a.status === "active");
    
    return {
      success: allSuccessful,
      assignments
    };
  }
  
  // Utility method to get the current service assignments
  getServiceAssignments() {
    return this.serviceAssignments;
  }
}