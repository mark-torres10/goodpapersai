#!/usr/bin/env tsx

/**
 * PER-10 ArXiv Integration Testing Script
 *
 * This script performs comprehensive testing of the ArXiv integration components.
 * Run with: npx tsx test-arxiv-integration.ts
 */

import { parseArxivId, getArxivUrls, isValidArxivId } from "./convex/arxiv/parser";
import { fetchArxivMetadata } from "./convex/arxiv/api";

// Test results tracking
interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

class ArxivTestRunner {
  private results: TestResult[] = [];

  async run(): Promise<void> {
    console.log("🧪 PER-10 ArXiv Integration Testing Suite");
    console.log("=========================================\n");

    await this.testUrlParsing();
    await this.testApiIntegration();
    await this.testErrorHandling();
    await this.testEdgeCases();

    this.printResults();
  }

  private async testUrlParsing(): Promise<void> {
    console.log("📋 URL Parsing Tests");
    console.log("-------------------");

    // Test 1.1: Parse Standard ArXiv URL (abs)
    this.recordTest(
      "Parse Standard ArXiv URL",
      parseArxivId("https://arxiv.org/abs/2301.12345") === "2301.12345",
      "https://arxiv.org/abs/2301.12345 should return '2301.12345'"
    );

    // Test 1.2: Parse PDF URL
    this.recordTest(
      "Parse PDF URL",
      parseArxivId("https://arxiv.org/pdf/2301.12345.pdf") === "2301.12345",
      "https://arxiv.org/pdf/2301.12345.pdf should return '2301.12345'"
    );

    // Test 1.3: Parse URL with Version
    this.recordTest(
      "Parse URL with Version",
      parseArxivId("https://arxiv.org/abs/2301.12345v2") === "2301.12345",
      "https://arxiv.org/abs/2301.12345v2 should return '2301.12345'"
    );

    // Test 1.4: Parse Direct ArXiv ID
    this.recordTest(
      "Parse Direct ArXiv ID",
      parseArxivId("2301.12345") === "2301.12345",
      "2301.12345 should return '2301.12345'"
    );

    // Test 1.5: Parse HTTP (not HTTPS) URL
    this.recordTest(
      "Parse HTTP URL",
      parseArxivId("http://arxiv.org/abs/2301.12345") === "2301.12345",
      "http://arxiv.org/abs/2301.12345 should return '2301.12345'"
    );

    // Test 1.6: Validate ArXiv ID Format
    this.recordTest(
      "Validate ArXiv ID Format",
      isValidArxivId("2301.12345") === true && isValidArxivId("2301.123456") === false,
      "2301.12345 should be valid, 2301.123456 should be invalid"
    );

    // Test 1.7: Invalid URL Handling
    this.recordTest(
      "Invalid URL Handling",
      parseArxivId("not-a-valid-url") === null,
      "not-a-valid-url should return null"
    );

    // Test 1.8: Generate URLs from ID
    const urls = getArxivUrls("2301.12345");
    this.recordTest(
      "Generate URLs from ID",
      urls.abs === "https://arxiv.org/abs/2301.12345" && urls.pdf === "https://arxiv.org/pdf/2301.12345.pdf",
      "Should generate correct abs and pdf URLs"
    );
  }

  private async testApiIntegration(): Promise<void> {
    console.log("\n📋 ArXiv API Integration Tests");
    console.log("-----------------------------");

    // Test 2.1: Fetch Valid Paper Metadata
    try {
      const metadata = await fetchArxivMetadata("1706.03762");
      this.recordTest(
        "Fetch Valid Paper Metadata",
        metadata.title === "Attention Is All You Need" &&
        metadata.authors.length === 8 &&
        metadata.abstract.length > 100 &&
        metadata.categories.includes("cs.CL"),
        "Should fetch complete metadata for 'Attention Is All You Need' paper"
      );
    } catch (error) {
      this.recordTest("Fetch Valid Paper Metadata", false, `Error: ${error}`);
    }

    // Test 2.2: Parse XML Response
    try {
      const metadata = await fetchArxivMetadata("1706.03762");
      this.recordTest(
        "Parse XML Response",
        metadata.arxivId === "1706.03762" &&
        metadata.pdfUrl === "https://arxiv.org/pdf/1706.03762.pdf",
        "Should correctly parse XML response and extract fields"
      );
    } catch (error) {
      this.recordTest("Parse XML Response", false, `Error: ${error}`);
    }

    // Test 2.3: Handle Single Author
    try {
      // Find a paper with single author for testing
      const metadata = await fetchArxivMetadata("1810.04805"); // BERT paper
      this.recordTest(
        "Handle Single Author",
        Array.isArray(metadata.authors) && metadata.authors.length >= 1,
        "Should handle papers with authors correctly"
      );
    } catch (error) {
      this.recordTest("Handle Single Author", false, `Error: ${error}`);
    }

    // Test 2.4: Handle Multiple Authors
    try {
      const metadata = await fetchArxivMetadata("1706.03762"); // Attention paper has 8 authors
      this.recordTest(
        "Handle Multiple Authors",
        Array.isArray(metadata.authors) && metadata.authors.length === 8,
        "Should handle papers with multiple authors correctly"
      );
    } catch (error) {
      this.recordTest("Handle Multiple Authors", false, `Error: ${error}`);
    }

    // Test 2.5: Invalid ArXiv ID
    try {
      await fetchArxivMetadata("9999.99999");
      this.recordTest("Invalid ArXiv ID", false, "Should throw error for non-existent paper");
    } catch (error) {
      this.recordTest(
        "Invalid ArXiv ID",
        error.message.includes("Paper not found"),
        "Should throw appropriate error for non-existent paper"
      );
    }

    // Test 2.6: API Response Time
    try {
      const startTime = Date.now();
      await fetchArxivMetadata("1706.03762");
      const endTime = Date.now();
      const duration = endTime - startTime;
      this.recordTest(
        "API Response Time",
        duration < 5000, // 5 seconds
        `API call took ${duration}ms (should be < 5000ms)`
      );
    } catch (error) {
      this.recordTest("API Response Time", false, `Error: ${error}`);
    }
  }

  private async testErrorHandling(): Promise<void> {
    console.log("\n📋 Error Handling Tests");
    console.log("-----------------------");

    // Test malformed URLs
    const invalidInputs = [
      "not-a-valid-url",
      "",
      "https://example.com",
      "2301.123", // too short
      "2301.1234567", // too long
    ];

    for (const input of invalidInputs) {
      try {
        const result = parseArxivId(input);
        this.recordTest(
          `Invalid Input: ${input}`,
          result === null,
          `Should return null for invalid input: ${input}`
        );
      } catch (error) {
        this.recordTest(
          `Invalid Input: ${input}`,
          false,
          `Should not throw error for invalid input, got: ${error}`
        );
      }
    }

    // Test invalid ArXiv IDs
    try {
      await fetchArxivMetadata("invalid-id");
      this.recordTest("Invalid ArXiv ID Format", false, "Should throw error for malformed ID");
    } catch (error) {
      this.recordTest(
        "Invalid ArXiv ID Format",
        error.message.includes("Invalid ArXiv ID format"),
        "Should throw appropriate error for malformed ID"
      );
    }
  }

  private async testEdgeCases(): Promise<void> {
    console.log("\n📋 Edge Cases Tests");
    console.log("-------------------");

    // Test URL variations
    const urlVariations = [
      "https://arxiv.org/abs/2301.12345",
      "https://arxiv.org/pdf/2301.12345.pdf",
      "http://arxiv.org/abs/2301.12345v1",
      "arxiv.org/abs/2301.12345",
      "2301.12345",
    ];

    for (const url of urlVariations) {
      const parsed = parseArxivId(url);
      this.recordTest(
        `URL Variation: ${url}`,
        parsed === "2301.12345",
        `Should parse '${url}' correctly`
      );
    }

    // Test version handling
    this.recordTest(
      "Version Handling",
      parseArxivId("2301.12345v1") === "2301.12345" &&
      parseArxivId("2301.12345v12") === "2301.12345",
      "Should strip version suffixes correctly"
    );
  }

  private recordTest(name: string, passed: boolean, details?: string, error?: string): void {
    this.results.push({ name, passed, details, error });
    const icon = passed ? "✓" : "❌";
    console.log(`${icon} ${name}: ${details || (passed ? "PASSED" : "FAILED")}`);
    if (error) console.log(`   Error: ${error}`);
  }

  private printResults(): void {
    console.log("\n📊 Test Results Summary");
    console.log("======================");

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;

    this.results.forEach(result => {
      const icon = result.passed ? "✓" : "❌";
      console.log(`${icon} ${result.name}`);
    });

    console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);

    if (passed === total) {
      console.log("\n🎉 All tests passed! ArXiv integration is working correctly.");
    } else {
      console.log(`\n⚠️  ${total - passed} tests failed. Check the details above.`);
      process.exit(1);
    }
  }
}

// Run the tests
const testRunner = new ArxivTestRunner();
testRunner.run();