/**
 * Billing Status Routes
 * 
 * This module provides endpoints for checking the status and usage of Google Cloud API keys.
 * It also allows assigning services to different API key groups dynamically.
 */

import { Router } from 'express';
import { ApiKeyManager } from '../services/api-key-manager';
import { BillingStatusService } from '../services/billing-status';
import { aiConfig } from '../config/api-keys';

const router = Router();
const apiKeyManager = ApiKeyManager.getInstance();
const billingStatus = new BillingStatusService();

/**
 * Get the status of all Google Cloud services
 */
router.get('/api/google-cloud/status', async (req, res) => {
  try {
    const serviceStatus = apiKeyManager.getAllServiceStatus();
    const serviceAssignments = apiKeyManager.getServiceAssignments();
    
    const availableApis = aiConfig.services
      .filter(service => serviceStatus[service.id]?.isActive)
      .map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        status: serviceStatus[service.id] || { isActive: false, message: 'Not initialized' },
        assignment: serviceAssignments[service.id] ? 
          { group: serviceAssignments[service.id].group } : 
          { group: service.defaultGroup }
      }));
    
    const missingApis = aiConfig.services
      .filter(service => !serviceStatus[service.id]?.isActive)
      .map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        status: serviceStatus[service.id] || { isActive: false, message: 'Not initialized' },
        assignment: serviceAssignments[service.id] ? 
          { group: serviceAssignments[service.id].group } : 
          { group: service.defaultGroup }
      }));
    
    res.json({
      success: true,
      availableApis,
      missingApis,
      apiKeyGroups: aiConfig.keyGroups.map(group => ({
        name: group.name,
        priority: group.priority,
        services: group.services
      }))
    });
  } catch (error) {
    console.error('Error retrieving Google Cloud status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get the status of a specific Google Cloud service
 */
router.get('/api/google-cloud/status/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const status = apiKeyManager.getServiceStatus(service);
    const serviceConfig = aiConfig.services.find(s => s.id === service);
    
    if (!serviceConfig) {
      return res.status(404).json({
        success: false,
        error: `Service ${service} not found`
      });
    }
    
    const assignment = apiKeyManager.getServiceAssignments()[service];
    
    res.json({
      success: true,
      service: {
        id: serviceConfig.id,
        name: serviceConfig.name,
        description: serviceConfig.description,
        status,
        assignment: assignment ? 
          { group: assignment.group } : 
          { group: serviceConfig.defaultGroup }
      }
    });
  } catch (error) {
    console.error(`Error retrieving status for service ${req.params.service}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Initialize a specific Google Cloud service
 */
router.post('/api/google-cloud/initialize/:service', async (req, res) => {
  try {
    const { service } = req.params;
    const result = await apiKeyManager.initializeService(service);
    
    res.json({
      success: result.status === 'active',
      service: result.service,
      status: result.status,
      assignedGroup: result.assignedGroup,
      error: result.error
    });
  } catch (error) {
    console.error(`Error initializing service ${req.params.service}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Initialize all Google Cloud services
 */
router.post('/api/google-cloud/initialize-all', async (req, res) => {
  try {
    const services = req.body.services || aiConfig.services.map(s => s.id);
    const result = await apiKeyManager.initializeAllServices(services);
    
    res.json({
      success: result.success,
      services: result.assignments.map(assignment => ({
        service: assignment.service,
        status: assignment.status,
        assignedGroup: assignment.assignedGroup,
        error: assignment.error
      }))
    });
  } catch (error) {
    console.error('Error initializing all services:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Assign a service to a specific API key group
 */
router.post('/api/google-cloud/assign', async (req, res) => {
  try {
    const { service, group } = req.body;
    
    if (!service || !group) {
      return res.status(400).json({
        success: false,
        error: 'Service and group are required'
      });
    }
    
    const success = apiKeyManager.forceServiceGroup(service, group);
    
    if (!success) {
      return res.status(400).json({
        success: false,
        error: `Failed to assign service ${service} to group ${group}`
      });
    }
    
    // Re-initialize the service with the new key
    const result = await apiKeyManager.initializeService(service);
    
    res.json({
      success: result.status === 'active',
      service: result.service,
      status: result.status,
      assignedGroup: result.assignedGroup,
      error: result.error
    });
  } catch (error) {
    console.error('Error assigning service to group:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Clear the status cache for a service
 */
router.post('/api/google-cloud/clear-cache/:service', (req, res) => {
  try {
    const { service } = req.params;
    billingStatus.clearServiceCache(service);
    
    res.json({
      success: true,
      message: `Cache cleared for service ${service}`
    });
  } catch (error) {
    console.error(`Error clearing cache for service ${req.params.service}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Clear all status cache
 */
router.post('/api/google-cloud/clear-all-cache', (req, res) => {
  try {
    billingStatus.clearAllCache();
    
    res.json({
      success: true,
      message: 'All cache cleared'
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;