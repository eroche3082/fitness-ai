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
  status: 'active' | 'pending' | 'failed';
  error?: string;
}

interface ServiceInitResult {
  success: boolean;
  assignments: ServiceAssignment[];
}

interface ServiceStatus {
  isActive: boolean;
  message: string;
  error?: string;
  quotaLimits?: Record<string, number>;
  quotaUsage?: Record<string, number>;
}

/**
 * API Key Manager
 * 
 * This class manages the API keys for various Google Cloud services.
 * It distributes services across different API key groups based on priority
 * and handles fallbacks when a service fails with one key.
 */
export class ApiKeyManager {
  private static instance: ApiKeyManager;
  private keyGroups: ApiKeyGroup[];
  private serviceAssignments: Record<string, { group: string, key: string }> = {};
  private serviceStatus: Record<string, ServiceStatus> = {};
  
  private constructor() {
    this.keyGroups = aiConfig.keyGroups;
    this.initServiceStatus();
  }
  
  /**
   * Get or create the singleton instance
   */
  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }
  
  /**
   * Initialize service status for all services
   */
  private initServiceStatus(): void {
    aiConfig.services.forEach(service => {
      this.serviceStatus[service.id] = {
        isActive: false,
        message: 'Not initialized'
      };
    });
  }
  
  /**
   * Get the API key for a specific service
   */
  public getApiKeyForService(service: string): string | null {
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
      key: selectedGroup.key as string
    };
    
    console.log(`Assigned ${service} to API key group: ${selectedGroup.name}`);
    return selectedGroup.key as string;
  }
  
  /**
   * Fallback to next available API key group for a service
   */
  public fallbackToNextApiKeyGroup(service: string): string | null {
    const currentAssignment = this.serviceAssignments[service];
    if (!currentAssignment) {
      return this.getApiKeyForService(service);
    }
    
    // Get current group priority
    const currentGroup = this.keyGroups.find(group => group.name === currentAssignment.group);
    if (!currentGroup) return null;
    
    // Find the next highest priority group that supports this service
    const nextGroup = this.keyGroups
      .filter(group => 
        group.services.includes(service) && 
        group.key && 
        group.priority > currentGroup.priority
      )
      .sort((a, b) => a.priority - b.priority)[0];
    
    if (!nextGroup) {
      console.warn(`No fallback API key group available for service: ${service}`);
      return null;
    }
    
    this.serviceAssignments[service] = {
      group: nextGroup.name,
      key: nextGroup.key as string
    };
    
    console.log(`Fallback: Reassigned ${service} to API key group: ${nextGroup.name}`);
    return nextGroup.key as string;
  }
  
  /**
   * Initialize a specific service with the best available API key
   */
  public async initializeService(service: string): Promise<ServiceAssignment> {
    const apiKey = this.getApiKeyForService(service);
    
    if (!apiKey) {
      this.serviceStatus[service] = {
        isActive: false,
        message: 'No API key available for this service',
        error: 'API key configuration error'
      };
      
      return {
        service,
        assignedGroup: "NONE", 
        status: 'failed',
        error: 'No API key available for this service'
      };
    }
    
    try {
      // Here we would make an actual API call to verify the service
      // For now, we'll simulate with the BillingStatus service
      const billingStatus = new BillingStatusService();
      const status = await billingStatus.checkApiKeyStatus(service, apiKey);
      
      this.serviceStatus[service] = {
        isActive: status.isActive,
        message: status.message,
        error: status.error,
        quotaLimits: status.quotaLimits,
        quotaUsage: status.quotaUsage
      };
      
      return {
        service,
        assignedGroup: this.serviceAssignments[service].group,
        status: status.isActive ? 'active' : 'failed',
        error: status.error
      };
    } catch (error) {
      this.serviceStatus[service] = {
        isActive: false,
        message: 'Error initializing service',
        error: error instanceof Error ? error.message : String(error)
      };
      
      return {
        service,
        assignedGroup: this.serviceAssignments[service].group,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Initialize all provided services
   */
  public async initializeAllServices(services: string[]): Promise<ServiceInitResult> {
    const assignments: ServiceAssignment[] = [];
    
    for (const service of services) {
      const result = await this.initializeService(service);
      assignments.push(result);
      
      // If service failed and fallback is available, try with fallback
      if (result.status === 'failed') {
        const fallbackKey = this.fallbackToNextApiKeyGroup(service);
        if (fallbackKey) {
          console.log(`Attempting fallback for ${service}...`);
          const fallbackResult = await this.initializeService(service);
          
          // Replace the failed result with the fallback result
          const index = assignments.findIndex(a => a.service === service);
          if (index !== -1) {
            assignments[index] = fallbackResult;
          }
        }
      }
    }
    
    const allSuccessful = assignments.every(a => a.status === 'active');
    
    return {
      success: allSuccessful,
      assignments
    };
  }
  
  /**
   * Get the status of a specific service
   */
  public getServiceStatus(service: string): ServiceStatus {
    return this.serviceStatus[service] || {
      isActive: false,
      message: 'Service not registered'
    };
  }
  
  /**
   * Get the status of all services
   */
  public getAllServiceStatus(): Record<string, ServiceStatus> {
    return this.serviceStatus;
  }
  
  /**
   * Get the current service assignments
   */
  public getServiceAssignments(): Record<string, { group: string, key: string }> {
    return this.serviceAssignments;
  }
  
  /**
   * Force a service to use a specific API key group
   */
  public forceServiceGroup(service: string, groupName: string): boolean {
    const group = this.keyGroups.find(g => g.name === groupName);
    if (!group || !group.key) return false;
    
    this.serviceAssignments[service] = {
      group: group.name,
      key: group.key
    };
    
    return true;
  }
}