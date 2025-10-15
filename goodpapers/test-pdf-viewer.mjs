#!/usr/bin/env node
import { chromium } from '@playwright/test';

async function testApp() {
  console.log('🚀 Starting browser tests...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const results = {
    passed: [],
    failed: []
  };
  
  // Collect console messages
  const consoleMessages = [];
  const consoleErrors = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Test 1: Homepage loads
  try {
    console.log('📋 Test 1: Homepage loads without CSP errors');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check for CSP violations in console
    const cspErrors = consoleErrors.filter(err => 
      err.includes('Content Security Policy') || 
      err.includes('Refused to') ||
      err.includes('blocked by CSP')
    );
    
    if (cspErrors.length > 0) {
      results.failed.push(`Homepage has CSP errors: ${cspErrors.join(', ')}`);
      console.log('   ❌ FAILED: CSP errors detected');
      cspErrors.forEach(err => console.log(`      - ${err}`));
    } else {
      results.passed.push('Homepage loads without CSP errors');
      console.log('   ✅ PASSED: No CSP errors\n');
    }
  } catch (error) {
    results.failed.push(`Homepage load failed: ${error.message}`);
    console.log(`   ❌ FAILED: ${error.message}\n`);
  }

  // Test 2: Worker file is accessible
  try {
    console.log('📋 Test 2: PDF.js worker is accessible');
    const response = await page.goto('http://localhost:3000/static/pdfjs/pdf.worker.min.mjs');
    const contentType = response.headers()['content-type'];
    const status = response.status();
    
    if (status === 200 && contentType.includes('javascript')) {
      results.passed.push(`Worker file accessible (${status}, ${contentType})`);
      console.log(`   ✅ PASSED: Worker returns ${status} with ${contentType}\n`);
    } else {
      results.failed.push(`Worker file issue: ${status}, ${contentType}`);
      console.log(`   ❌ FAILED: ${status}, ${contentType}\n`);
    }
  } catch (error) {
    results.failed.push(`Worker file test failed: ${error.message}`);
    console.log(`   ❌ FAILED: ${error.message}\n`);
  }

  // Test 3: Invalid paper ID shows error message
  try {
    console.log('📋 Test 3: Invalid paper ID shows error state');
    consoleErrors.length = 0; // Clear previous errors
    
    await page.goto('http://localhost:3000/paper/invalidpaperid123', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Look for error message
    const errorHeading = await page.locator('h2:has-text("Invalid Paper ID")').first();
    const isVisible = await errorHeading.isVisible().catch(() => false);
    
    // Check for DOMMatrix errors
    const domMatrixErrors = consoleErrors.filter(err => 
      err.includes('DOMMatrix') || 
      err.includes('not defined')
    );
    
    if (domMatrixErrors.length > 0) {
      results.failed.push('DOMMatrix or undefined errors detected');
      console.log('   ❌ FAILED: DOMMatrix errors detected');
      domMatrixErrors.forEach(err => console.log(`      - ${err}`));
    } else if (isVisible) {
      results.passed.push('Invalid paper ID shows error message');
      console.log('   ✅ PASSED: Error message displayed correctly\n');
    } else {
      results.failed.push('Error message not visible');
      console.log('   ❌ FAILED: Error message not visible\n');
    }
  } catch (error) {
    results.failed.push(`Invalid paper ID test failed: ${error.message}`);
    console.log(`   ❌ FAILED: ${error.message}\n`);
  }

  // Test 4: Check CSP header
  try {
    console.log('📋 Test 4: CSP header validation');
    const response = await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    const cspHeader = response.headers()['content-security-policy'];
    
    const hasUnsafeInline = cspHeader.includes("'unsafe-inline'") && cspHeader.includes("script-src");
    const hasUnsafeEval = cspHeader.includes("'unsafe-eval'");
    const hasWorkerSelf = cspHeader.includes("worker-src 'self' blob:");
    
    // Check for problematic directives
    if (hasUnsafeEval) {
      results.failed.push("CSP has 'unsafe-eval' (not needed with self-hosted worker)");
      console.log("   ❌ FAILED: 'unsafe-eval' present\n");
    } else {
      results.passed.push("CSP does not contain 'unsafe-eval' (✅ worker self-hosted)");
      console.log("   ✅ PASSED: No 'unsafe-eval' (worker self-hosted)\n");
    }
    
    // Note: unsafe-inline is expected in dev mode for Next.js HMR
    if (hasUnsafeInline) {
      results.passed.push("'unsafe-inline' present (expected for Next.js dev mode)");
      console.log("   ℹ️  INFO: 'unsafe-inline' present (expected for Next.js dev/HMR)\n");
    }
    
    if (hasWorkerSelf) {
      results.passed.push("Worker-src correctly configured for self-hosted PDF.js");
      console.log("   ✅ PASSED: worker-src 'self' blob: configured\n");
    }
    
    console.log(`   📝 CSP: ${cspHeader.substring(0, 120)}...\n`);
  } catch (error) {
    results.failed.push(`CSP header test failed: ${error.message}`);
    console.log(`   ❌ FAILED: ${error.message}\n`);
  }

  await browser.close();
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log(`✅ Passed: ${results.passed.length}`);
  results.passed.forEach(test => console.log(`   • ${test}`));
  
  console.log(`\n❌ Failed: ${results.failed.length}`);
  results.failed.forEach(test => console.log(`   • ${test}`));
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
  
  if (results.failed.length > 0) {
    console.log('❌ Some tests failed');
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
    process.exit(0);
  }
}

testApp().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});

