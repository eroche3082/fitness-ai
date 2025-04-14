// Service Initialization Test
// This script tests the initialization of all Google Cloud services
// with the API Key Manager service

import { ApiKeyManager } from '../services/api-key-manager.js';

async function runServiceTest() {
  console.log('==== GOOGLE CLOUD SERVICES INITIALIZATION TEST ====');
  
  const apiKeyManager = ApiKeyManager.getInstance();
  
  // List of all services to test
  const servicesToTest = [
    'texttospeech',
    'speech',
    'vision',
    'language',
    'translation',
    'vertex',
    'gemini',
    'sheets',
    'gmail',
    'calendar',
    'drive',
    'firebase'
  ];
  
  console.log(`Testing initialization of ${servicesToTest.length} services...\n`);
  
  try {
    const result = await apiKeyManager.initializeAllServices(servicesToTest);
    
    console.log('\n==== TEST RESULTS ====');
    console.log(`Services tested: ${servicesToTest.length}`);
    console.log(`Services initialized: ${result.assignments.filter(a => a.status === 'active').length}`);
    console.log(`Services failed: ${result.assignments.filter(a => a.status === 'failed').length}`);
    console.log(`Overall success: ${result.success ? 'YES' : 'NO'}`);
    
    console.log('\n==== SERVICE ASSIGNMENT DETAILS ====');
    result.assignments.forEach(assignment => {
      const statusIcon = assignment.status === 'active' ? '✅' : assignment.status === 'failed' ? '❌' : '⏳';
      console.log(`${statusIcon} ${assignment.service.padEnd(15)} → [${assignment.assignedGroup}] (${assignment.status})`);
    });
    
    console.log('\n==== API KEY GROUP DISTRIBUTION ====');
    const groupCounts = result.assignments.reduce((acc, assignment) => {
      acc[assignment.assignedGroup] = (acc[assignment.assignedGroup] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(groupCounts).forEach(([group, count]) => {
      console.log(`${group}: ${count} service(s)`);
    });
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
runServiceTest();