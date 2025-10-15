// Test file for ArXiv ID parsing functions
import { parseArxivId, getArxivUrls, isValidArxivId } from "./parser";

// Test cases for parseArxivId
console.log("Testing parseArxivId:");
console.log("https://arxiv.org/abs/2301.12345 ->", parseArxivId("https://arxiv.org/abs/2301.12345")); // "2301.12345"
console.log("https://arxiv.org/pdf/2301.12345.pdf ->", parseArxivId("https://arxiv.org/pdf/2301.12345.pdf")); // "2301.12345"
console.log("2301.12345v2 ->", parseArxivId("2301.12345v2")); // "2301.12345"
console.log("2301.12345 ->", parseArxivId("2301.12345")); // "2301.12345"
console.log("invalid ->", parseArxivId("invalid")); // null

console.log("\nTesting getArxivUrls:");
const urls = getArxivUrls("2301.12345");
console.log("ArXiv URLs for 2301.12345:", urls);

console.log("\nTesting isValidArxivId:");
console.log("2301.12345 ->", isValidArxivId("2301.12345")); // true
console.log("2301.123 ->", isValidArxivId("2301.123")); // false
console.log("invalid ->", isValidArxivId("invalid")); // false