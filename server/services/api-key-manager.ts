import { aiConfig } from '../config/api-keys';
import { BillingStatusService } from './billing-status';

interface ApiKeyGroup {
  name: string;
  envVariable: string;
  key: string | undefined;
  services: string[];
  priority: number;
}

interface ServiceAssignment {
  service: string;
  assignedGroup: string;
  status: 'active' | 'failed' | 'pending';
  timestamp: Date;
}

/**
 * API Key Manager service that handles dynamic API key assignment and switching
 * based on service requirements and key availability
 */
export class ApiKeyManager {
  private static instance: ApiKeyManager;
  private keyGroups: ApiKeyGroup[] = [];
  private serviceAssignments: ServiceAssignment[] = [];
  private billingStatusService: BillingStatusService;
  private agentName: string = 'Fitness AI';

  private constructor() {
    this.billingStatusService = new BillingStatusService();
    this.loadApiKeyGroups();
  }

  /**
   * Get singleton instance of ApiKeyManager
   */
  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  /**
   * Load all API Key Groups from environment variables
   */
  private loadApiKeyGroups(): void {
    this.keyGroups = [
      {
        name: 'GROUP1',
        envVariable: 'GOOGLE_GROUP1_API_KEY',
        key: process.env.GOOGLE_GROUP1_API_KEY,
        services: ['gemini', 'vertex', 'vision', 'ai', 'ml', 'bigquery', 'firestore', 'maps', 'places', 'travel', 'weather'],
        priority: 1
      },
      {
        name: 'GROUP2',
        envVariable: 'GOOGLE_GROUP2_API_KEY',
        key: process.env.GOOGLE_GROUP2_API_KEY,
        services: ['gemini', 'vertex', 'vision', 'ai', 'ml', 'bigquery', 'firestore', 'gmail', 'docs', 'calendar', 'meet', 'youtube', 'sheets'],
        priority: 2
      },
      {
        name: 'GROUP3',
        envVariable: 'GOOGLE_GROUP3_API_KEY',
        key: process.env.GOOGLE_GROUP3_API_KEY,
        services: ['firebase', 'realtime-db', 'hosting', 'messaging', 'in-app-config', 'gmail', 'docs', 'calendar', 'meet', 'youtube', 'sheets', 'maps', 'places', 'travel', 'weather'],
        priority: 3
      },
      {
        name: 'GOOGLE_API',
        envVariable: 'GOOGLE_API_KEY',
        key: process.env.GOOGLE_API_KEY,
        services: [
          'texttospeech', 'speech', 'vision', 'language', 'translation',
          'vertex', 'gemini', 'sheets', 'gmail', 'calendar', 'drive',
          'firebase', 'realtime-db', 'hosting', 'messaging', 'in-app-config'
        ],
        priority: 1 // Make this the highest priority since it's the universal key
      }
    ];

    // Filter out groups with undefined keys
    this.keyGroups = this.keyGroups.filter(group => !!group.key);
    
    // Sort by priority
    this.keyGroups.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Find the most suitable API key group for a given service
   * @param service The service to find an API key group for
   * @returns The most suitable API key group
   */
  private findSuitableKeyGroup(service: string): ApiKeyGroup | null {
    // First try to find groups that explicitly support this service
    const matchingGroups = this.keyGroups.filter(group => 
      group.services.includes(service.toLowerCase())
    );

    if (matchingGroups.length > 0) {
      return matchingGroups[0]; // Return the highest priority matching group
    }

    // If no matching groups, return the default fallback
    // Following the fallback logic, starting with the universal API key: GOOGLE_API → GROUP1 → GROUP2 → GROUP3
    const fallbackOrder = ['GOOGLE_API', 'GROUP1', 'GROUP2', 'GROUP3'];
    
    for (const groupName of fallbackOrder) {
      const group = this.keyGroups.find(g => g.name === groupName);
      if (group) {
        return group;
      }
    }

    return null;
  }

  /**
   * Analyze the required services for the agent and assign the most suitable API keys
   * @param requiredServices List of services required by the agent
   */
  public analyzeAndAssignKeys(requiredServices: string[]): void {
    console.log(`${this.agentName} analyzing required services: ${requiredServices.join(', ')}`);
    
    // Clear previous assignments
    this.serviceAssignments = [];
    
    for (const service of requiredServices) {
      const keyGroup = this.findSuitableKeyGroup(service);
      
      if (keyGroup) {
        this.serviceAssignments.push({
          service,
          assignedGroup: keyGroup.name,
          status: 'pending',
          timestamp: new Date()
        });
        
        console.log(`[${this.agentName}] assigned ${service} to ${keyGroup.name}`);
      } else {
        console.error(`[${this.agentName}] No suitable API key group found for ${service}`);
      }
    }
  }

  /**
   * Initialize a service with its assigned API key
   * @param service The service to initialize
   * @returns Success status
   */
  public async initializeService(service: string): Promise<boolean> {
    const assignment = this.serviceAssignments.find(a => a.service === service);
    
    if (!assignment) {
      console.error(`[${this.agentName}] No assignment found for ${service}`);
      return false;
    }
    
    const keyGroup = this.keyGroups.find(g => g.name === assignment.assignedGroup);
    
    if (!keyGroup || !keyGroup.key) {
      console.error(`[${this.agentName}] Invalid key group for ${service}: ${assignment.assignedGroup}`);
      return false;
    }
    
    try {
      // Switch to the assigned key
      const currentKey = aiConfig.apiKey;
      const success = await this.switchToKey(keyGroup.envVariable);
      
      if (success) {
        console.log(`[${this.agentName}] using [${keyGroup.name}] for [${service}] → ✅ Success`);
        
        // Update assignment status
        assignment.status = 'active';
        assignment.timestamp = new Date();
        
        return true;
      } else {
        // Try fallback groups if available
        console.warn(`[${this.agentName}] Failed to initialize ${service} with ${keyGroup.name}, trying fallbacks...`);
        
        // Switch back to original key in case of failure
        if (currentKey) {
          await this.switchToKey(currentKey);
        }
        
        assignment.status = 'failed';
        assignment.timestamp = new Date();
        
        return this.tryFallbackGroups(service);
      }
    } catch (error) {
      console.error(`[${this.agentName}] Error initializing ${service} with ${keyGroup.name}:`, error);
      
      assignment.status = 'failed';
      assignment.timestamp = new Date();
      
      return this.tryFallbackGroups(service);
    }
  }

  /**
   * Try fallback API key groups for a service if the primary group fails
   * @param service The service to initialize with fallback groups
   * @returns Success status
   */
  private async tryFallbackGroups(service: string): Promise<boolean> {
    const assignment = this.serviceAssignments.find(a => a.service === service);
    
    if (!assignment) {
      return false;
    }
    
    // Get all groups except the one that already failed
    const fallbackGroups = this.keyGroups.filter(g => g.name !== assignment.assignedGroup);
    
    // Sort fallbacks by priority
    fallbackGroups.sort((a, b) => a.priority - b.priority);
    
    for (const group of fallbackGroups) {
      try {
        const success = await this.switchToKey(group.envVariable);
        
        if (success) {
          console.log(`[${this.agentName}] using fallback [${group.name}] for [${service}] → ✅ Success`);
          
          // Update assignment
          assignment.assignedGroup = group.name;
          assignment.status = 'active';
          assignment.timestamp = new Date();
          
          return true;
        }
      } catch (error) {
        console.error(`[${this.agentName}] Error with fallback ${group.name} for ${service}:`, error);
      }
    }
    
    console.error(`[${this.agentName}] All API key groups failed for ${service}. Entering fallback mode.`);
    return false;
  }

  /**
   * Switch to a specific API key
   * @param keyName The name of the environment variable containing the key
   * @returns Success status
   */
  public async switchToKey(keyName: string): Promise<boolean> {
    try {
      // Use the existing billing status service to handle key switching
      await this.billingStatusService.reinitialize(process.env[keyName]);
      
      // Update the active key name in aiConfig
      aiConfig.activeKeyName = keyName;
      
      return true;
    } catch (error) {
      console.error(`Failed to switch to API key: ${keyName}`, error);
      return false;
    }
  }

  /**
   * Get summary of service assignments
   */
  public getServiceAssignmentSummary(): ServiceAssignment[] {
    return this.serviceAssignments;
  }

  /**
   * Initialize all required services for the agent
   * @param requiredServices List of services required by the agent
   */
  public async initializeAllServices(requiredServices: string[]): Promise<{
    success: boolean;
    assignments: ServiceAssignment[];
  }> {
    // First analyze and assign keys
    this.analyzeAndAssignKeys(requiredServices);
    
    // Then initialize each service
    const results = await Promise.all(
      requiredServices.map(service => this.initializeService(service))
    );
    
    const success = results.every(result => result);
    
    console.log(`[${this.agentName}] Service initialization complete. Overall success: ${success}`);
    return {
      success,
      assignments: this.serviceAssignments
    };
  }
}