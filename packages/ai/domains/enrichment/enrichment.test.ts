import { makeCompanyEnrichmentService } from './enrichment.service';
import type { EnrichmentRequest, EnrichmentProgress } from './types';

// Simple test runner
async function testEnrichmentService() {
  console.log('🧪 Testing Enrichment Service Refactor\n');
  
  const service = makeCompanyEnrichmentService();
  
  // Test case 1: Basic enrichment with specific types
  console.log('Test 1: Enriching with specific types (basic-info, funding)');
  const request1: EnrichmentRequest = {
    websiteUrl: 'https://www.example.com',
    enrichmentTypes: ['basic-info', 'funding'],
    requestId: 'test-1'
  };
  
  const progressUpdates: EnrichmentProgress[] = [];
  
  try {
    const result1 = await service.enrichCompany(request1, (progress) => {
      progressUpdates.push(progress);
      console.log(`Progress: ${progress.currentStep}/${progress.totalSteps} - ${progress.currentType || 'done'}`);
    });
    
    console.log('\nResult Summary:');
    console.log(`- Total Requested: ${result1.summary.totalRequested}`);
    console.log(`- Successful: ${result1.summary.successful}`);
    console.log(`- Failed: ${result1.summary.failed}`);
    console.log(`- Skipped: ${result1.summary.skipped}`);
    console.log(`- Duration: ${result1.summary.totalDuration}ms`);
    console.log('\nResults:', JSON.stringify(result1.results, null, 2));
  } catch (error) {
    console.error('Test 1 failed:', error);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test case 2: Test error handling with invalid URL
  console.log('Test 2: Error handling with invalid URL');
  const request2: EnrichmentRequest = {
    websiteUrl: 'not-a-valid-url',
    enrichmentTypes: ['basic-info'],
    requestId: 'test-2'
  };
  
  try {
    const result2 = await service.enrichCompany(request2);
    console.log('\nResult Summary:');
    console.log(`- Total Requested: ${result2.summary.totalRequested}`);
    console.log(`- Successful: ${result2.summary.successful}`);
    console.log(`- Failed: ${result2.summary.failed}`);
    console.log(`- Skipped: ${result2.summary.skipped}`);
    console.log('\nError details:', result2.results.filter(r => r.status === 'error'));
  } catch (error) {
    console.error('Test 2 failed:', error);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test case 3: Test parallel execution with all types
  console.log('Test 3: Full parallel enrichment (all types)');
  const request3: EnrichmentRequest = {
    websiteUrl: 'https://www.stripe.com',
    requestId: 'test-3'
    // No enrichmentTypes specified = run all
  };
  
  const startTime = Date.now();
  try {
    const result3 = await service.enrichCompany(request3);
    const totalTime = Date.now() - startTime;
    
    console.log('\nResult Summary:');
    console.log(`- Total Requested: ${result3.summary.totalRequested}`);
    console.log(`- Successful: ${result3.summary.successful}`);
    console.log(`- Failed: ${result3.summary.failed}`);
    console.log(`- Skipped: ${result3.summary.skipped}`);
    console.log(`- Service Duration: ${result3.summary.totalDuration}ms`);
    console.log(`- Total Time: ${totalTime}ms`);
    
    // Show results by status
    const byStatus = {
      success: result3.results.filter(r => r.status === 'success').map(r => r.type),
      error: result3.results.filter(r => r.status === 'error').map(r => r.type),
      skipped: result3.results.filter(r => r.status === 'skipped').map(r => r.type)
    };
    console.log('\nResults by status:', byStatus);
  } catch (error) {
    console.error('Test 3 failed:', error);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test case 4: Test individual enrichment function
  console.log('Test 4: Individual enrichment function (enrichBasicInfo)');
  try {
    const result4 = await service.enrichBasicInfo({
      websiteUrl: 'https://www.google.com'
    });
    console.log('Result:', result4);
  } catch (error) {
    console.error('Test 4 failed:', error);
  }
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testEnrichmentService().catch(console.error);
}

export { testEnrichmentService };