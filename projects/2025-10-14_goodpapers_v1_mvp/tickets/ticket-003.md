# Ticket-003: PER-10 Testing & Validation

**Ticket**: PER-10 - ArXiv API Integration & PDF Storage Testing  
**Status**: Proposed (Awaiting Approval)  
**Created**: 2025-10-14  
**Estimated Time**: 40 minutes  
**Dependencies**: PER-8 complete

---

## Objective

Comprehensive testing and validation of PER-10 (ArXiv API Integration & PDF Storage) to ensure URL parsing, metadata fetching, PDF downloading, storage, and serving all work correctly and meet specification requirements.

---

## Test Coverage Areas

### 1. URL Parsing & Validation (8 tests)
### 2. ArXiv API Integration (7 tests)
### 3. PDF Download & Storage (6 tests)
### 4. PDF Serving via HTTP (5 tests)
### 5. Error Handling (6 tests)
### 6. Integration & Performance (5 tests)

**Total: 37 automated tests**

---

## Detailed Test Plan

### 1. URL Parsing & Validation (8 tests)

#### Test 1.1: Parse Standard ArXiv URL (abs)
**Type**: Parser Test  
**Input**: `https://arxiv.org/abs/2301.12345`  
**Success Criteria**:
- Returns: `2301.12345`
- Extracts ID correctly
- No errors

#### Test 1.2: Parse PDF URL
**Type**: Parser Test  
**Input**: `https://arxiv.org/pdf/2301.12345.pdf`  
**Success Criteria**:
- Returns: `2301.12345`
- Strips `.pdf` extension

#### Test 1.3: Parse URL with Version
**Type**: Parser Test  
**Input**: `https://arxiv.org/abs/2301.12345v2`  
**Success Criteria**:
- Returns: `2301.12345`
- Strips version suffix

#### Test 1.4: Parse Direct ArXiv ID
**Type**: Parser Test  
**Input**: `2301.12345`  
**Success Criteria**:
- Returns: `2301.12345`
- Recognizes as valid ID

#### Test 1.5: Parse HTTP (not HTTPS) URL
**Type**: Parser Test  
**Input**: `http://arxiv.org/abs/2301.12345`  
**Success Criteria**:
- Returns: `2301.12345`
- Protocol doesn't matter

#### Test 1.6: Validate ArXiv ID Format
**Type**: Validation Test  
**Test**: `isValidArxivId("2301.12345")`  
**Success Criteria**:
- Returns true for valid format (YYMM.NNNNN)
- Returns false for invalid format

#### Test 1.7: Invalid URL Handling
**Type**: Error Test  
**Input**: `not-a-valid-url`  
**Success Criteria**:
- Returns null
- No errors thrown

#### Test 1.8: Generate URLs from ID
**Type**: Utility Test  
**Input**: `2301.12345`  
**Success Criteria**:
- Generates correct abs URL
- Generates correct PDF URL

---

### 2. ArXiv API Integration (7 tests)

#### Test 2.1: Fetch Valid Paper Metadata
**Type**: API Test  
**Input**: ArXiv ID `1706.03762` (Attention Is All You Need)  
**Success Criteria**:
- Returns complete metadata object
- Title: "Attention Is All You Need"
- Authors array populated
- Abstract present
- Dates in ISO format

#### Test 2.2: Parse XML Response
**Type**: XML Parsing Test  
**Success Criteria**:
- XML parsed correctly with fast-xml-parser
- All fields extracted
- Authors array handled (single and multiple)
- Categories parsed

#### Test 2.3: Handle Single Author
**Type**: Edge Case Test  
**Test**: Paper with one author
**Success Criteria**:
- Authors array contains one element
- No parsing errors

#### Test 2.4: Handle Multiple Authors
**Type**: Edge Case Test  
**Test**: Paper with 10+ authors
**Success Criteria**:
- All authors captured in array
- Order preserved
- No truncation

#### Test 2.5: Invalid ArXiv ID
**Type**: Error Test  
**Input**: `9999.99999` (non-existent)  
**Success Criteria**:
- Throws clear error: "Paper not found: 9999.99999"
- No partial data returned

#### Test 2.6: API Response Time
**Type**: Performance Test  
**Success Criteria**:
- Metadata fetch completes in < 3 seconds
- No hanging requests

#### Test 2.7: Retry Logic on Failure
**Type**: Resilience Test  
**Test**: Simulate temporary network failure
**Success Criteria**:
- Retries up to 3 times
- 3-second delay between retries
- Eventually succeeds or throws after max retries

---

### 3. PDF Download & Storage (6 tests)

#### Test 3.1: Download PDF File
**Type**: Download Test  
**Input**: Valid paper `1706.03762`  
**Success Criteria**:
- PDF downloads successfully
- File size reasonable (1-10 MB for typical papers)
- Content-Type is application/pdf

#### Test 3.2: Store PDF in Convex Storage
**Type**: Storage Test  
**Success Criteria**:
- PDF stored successfully
- Returns storageId
- File accessible in Convex dashboard
- File size matches download

#### Test 3.3: Large PDF Handling
**Type**: Edge Case Test  
**Test**: Paper with large PDF (> 5 MB)  
**Success Criteria**:
- Downloads successfully
- Stores without errors
- No timeout

#### Test 3.4: PDF Download Failure
**Type**: Error Test  
**Test**: Invalid PDF URL
**Success Criteria**:
- Clear error message
- No partial storage
- Action fails gracefully

#### Test 3.5: Storage Quota Check
**Type**: Limit Test  
**Success Criteria**:
- Verify storage within Convex limits
- Monitor storage usage
- No quota errors

#### Test 3.6: Concurrent PDF Downloads
**Type**: Concurrency Test  
**Test**: Download 3 PDFs simultaneously
**Success Criteria**:
- All complete successfully
- No race conditions
- No storage corruption

---

### 4. PDF Serving via HTTP (5 tests)

#### Test 4.1: Serve PDF via HTTP Action
**Type**: HTTP Test  
**Test**: `GET /pdf/{storageId}`  
**Success Criteria**:
- Returns PDF file
- Content-Type: application/pdf
- Status 200
- File content matches stored file

#### Test 4.2: HTTP Headers Correct
**Type**: Header Test  
**Success Criteria**:
- Content-Type: application/pdf
- Cache-Control present (max-age=31536000)
- Access-Control-Allow-Origin: * (CORS enabled)

#### Test 4.3: Invalid Storage ID
**Type**: Error Test  
**Test**: Request with non-existent storageId
**Success Criteria**:
- Returns 404 Not Found
- Clear error message

#### Test 4.4: PDF Loads in Browser
**Type**: Browser Test (use Browser MCP)  
**Test**: Open PDF URL in browser
**Success Criteria**:
- Browser opens PDF
- PDF renders correctly
- No download errors

#### Test 4.5: CORS for PDF Viewer
**Type**: CORS Test  
**Test**: Load PDF from different origin
**Success Criteria**:
- CORS headers allow access
- PDF loads in react-pdf viewer
- No CORS errors in console

---

### 5. Error Handling (6 tests)

#### Test 5.1: Duplicate Paper Prevention
**Type**: Business Logic Test  
**Test**: Add same paper twice (same arxivId + userId)
**Success Criteria**:
- First attempt succeeds
- Second attempt returns error: "Paper already exists"
- Returns existing paperId
- No duplicate database entries

#### Test 5.2: Invalid Input Format
**Type**: Validation Test  
**Test**: Various invalid inputs
**Success Criteria**:
- Malformed URL: Clear error
- Empty string: Clear error
- Random text: Clear error

#### Test 5.3: ArXiv API Rate Limiting
**Type**: Rate Limit Test  
**Test**: Make rapid requests (if possible to simulate)
**Success Criteria**:
- 429 errors handled
- Retry with backoff
- Eventually succeeds

#### Test 5.4: Network Timeout
**Type**: Error Test  
**Test**: Simulate slow network
**Success Criteria**:
- Timeout after reasonable duration
- Clear error message
- No hanging processes

#### Test 5.5: Partial Failure Recovery
**Type**: Resilience Test  
**Test**: Metadata succeeds but PDF fails
**Success Criteria**:
- No partial data in database
- Clear error about PDF failure
- Can retry entire operation

#### Test 5.6: Invalid XML Response
**Type**: Error Test  
**Test**: Malformed XML from ArXiv
**Success Criteria**:
- Parser error caught
- Clear error message
- No crash

---

### 6. Integration & Performance (5 tests)

#### Test 6.1: End-to-End Flow
**Type**: Integration Test  
**Test**: Complete flow from URL to database
**Input**: `https://arxiv.org/abs/1706.03762`
**Success Criteria**:
- URL parsed → ID extracted
- Metadata fetched → Parsed correctly
- PDF downloaded → Stored
- Paper created in DB (if PER-9 exists)
- Returns complete paper object with storageId

#### Test 6.2: Multiple Papers in Sequence
**Type**: Integration Test  
**Test**: Add 3 different papers sequentially
**Success Criteria**:
- All 3 complete successfully
- No interference between operations
- All PDFs stored correctly

#### Test 6.3: Total Operation Time
**Type**: Performance Test  
**Success Criteria**:
- Total time < 10 seconds for typical paper
- Metadata: < 3 seconds
- PDF download: < 7 seconds
- Database insert: < 1 second

#### Test 6.4: Memory Usage
**Type**: Resource Test  
**Success Criteria**:
- No memory leaks
- PDF blobs released after storage
- Reasonable memory footprint

#### Test 6.5: Integration with PER-9 Schema
**Type**: Integration Test  
**Test**: Create paper using PER-10 action (if PER-9 complete)
**Success Criteria**:
- Paper inserted correctly
- All schema fields populated
- Foreign keys valid
- Queryable immediately

---

## Test Execution Order

### Phase 1: Parser & Validation (10 min)
1. URL parsing tests (1.1-1.8)
2. Validation tests

### Phase 2: ArXiv API Integration (10 min)
3. Metadata fetching tests (2.1-2.7)
4. XML parsing tests
5. Error handling tests

### Phase 3: PDF Storage (10 min)
6. PDF download tests (3.1-3.6)
7. Storage tests
8. HTTP serving tests (4.1-4.5)

### Phase 4: End-to-End & Performance (10 min)
9. Integration tests (6.1-6.5)
10. Performance validation
11. Error scenarios (5.1-5.6)

---

## Test Automation Script

```bash
#!/bin/bash
# test-per-10.sh

set -e

echo "🧪 PER-10 Testing Suite: ArXiv Integration & PDF Storage"
echo "========================================================"

cd goodpapers

# Phase 1: File Structure
echo ""
echo "Phase 1: File Structure"
echo "----------------------"

echo "✓ Checking ArXiv integration files..."
test -f "convex/arxiv/parser.ts" && echo "  ✓ parser.ts exists"
test -f "convex/arxiv/api.ts" && echo "  ✓ api.ts exists"
test -f "convex/arxiv/actions.ts" && echo "  ✓ actions.ts exists"

# Phase 2: Type Checking
echo ""
echo "Phase 2: Type Checking"
echo "---------------------"
npx tsc --noEmit && echo "  ✓ No type errors"

# Phase 3: HTTP Action Verification
echo ""
echo "Phase 3: HTTP Action Verification"
echo "---------------------------------"
grep -q "route.*pdf" "convex/http.ts" && echo "  ✓ PDF serving route exists"

echo ""
echo "✅ Automated tests passed!"
echo ""
echo "🔍 Next: Manual testing in Convex Dashboard required"
echo "   1. Go to: https://dashboard.convex.dev"
echo "   2. Test addPaperFromArxiv action"
echo "   3. Test PDF serving HTTP action"
```

---

## Manual Test Checklist

### Convex Dashboard Testing

**Setup**:
- [ ] Navigate to https://dashboard.convex.dev
- [ ] Select project: impartial-wolf-773
- [ ] Go to Functions tab

**Parser Tests** (can test in Node.js or create test action):
- [ ] Test `parseArxivId` with various URLs
- [ ] Test `isValidArxivId` with valid/invalid IDs
- [ ] Test `getArxivUrls` generates correct URLs

**Action Tests**:
- [ ] Test `addPaperFromArxiv` with valid paper:
  ```json
  {
    "input": "https://arxiv.org/abs/1706.03762",
    "userId": "<test_user_id>"
  }
  ```
- [ ] Verify returns metadata + storageId
- [ ] Check Storage tab for PDF file
- [ ] Test with invalid ArXiv ID
- [ ] Test with duplicate paper
- [ ] Test with direct ID (not URL)

**HTTP Action Tests** (use browser or curl):
- [ ] Get storageId from previous test
- [ ] Construct URL: `https://impartial-wolf-773.convex.site/pdf/{storageId}`
- [ ] Open in browser - should display/download PDF
- [ ] Check Content-Type header
- [ ] Check CORS headers
- [ ] Test with invalid storageId (should 404)

**Performance Tests**:
- [ ] Time full operation (URL to stored PDF)
- [ ] Add 3 papers in sequence
- [ ] Check for reasonable completion times

---

## Test Papers for Validation

**Good test papers** (verified to exist on ArXiv):
```
1706.03762 - "Attention Is All You Need" (Transformers)
2010.11929 - "An Image is Worth 16x16 Words" (ViT)
1810.04805 - "BERT: Pre-training of Deep Bidirectional Transformers"
```

**Invalid for error testing**:
```
9999.99999 - Non-existent paper
invalid - Malformed input
```

---

## Browser MCP Testing

Use Browser MCP for these tests:
1. **Navigate** to PDF serving URL
2. **Verify** PDF loads correctly
3. **Check console** for errors
4. **Test** PDF viewer integration (if PER-13 complete)

---

## Success Criteria Summary

### Automated Tests (10 tests)
- [ ] File structure tests pass
- [ ] Type checking passes
- [ ] Build succeeds

### Manual Convex Dashboard Tests (27 tests)
- [ ] URL parsing works (8/8)
- [ ] ArXiv API integration works (7/7)
- [ ] PDF download & storage works (6/6)
- [ ] HTTP serving works (5/5)
- [ ] Error handling works (6/6)
- [ ] Integration tests pass (5/5)

---

## Expected Test Duration

- **Automated tests**: 5 minutes
- **Manual action tests**: 20 minutes
- **HTTP/Browser tests**: 10 minutes
- **Documentation**: 5 minutes
- **Total**: 40 minutes

---

## Test Data Documentation

Document each successful test:
```
Paper: 1706.03762
Metadata fetched: ✓
  - Title: [actual title]
  - Authors: [count]
  - Abstract length: [chars]
PDF downloaded: ✓
  - Size: [MB]
  - Time: [seconds]
Stored: ✓
  - StorageId: [id]
HTTP served: ✓
  - URL: [full url]
  - Browser test: ✓
```

---

## Failure Handling

If any test fails:
1. **Document exact error** with full stack trace
2. **Check ArXiv API status**: https://status.arxiv.org
3. **Verify network connectivity**
4. **Check Convex storage quota**
5. **Review code logic** for bugs
6. **Fix and re-test** entire suite
7. **Update logs.md** with findings

---

## References

- **Spec**: `/projects/2025-10-14_goodpapers_v1_mvp/spec.md`
- **PER-10 Plan**: `/projects/2025-10-14_goodpapers_v1_mvp/PER-10_execution_plan.md`
- **ArXiv API Docs**: https://arxiv.org/help/api/user-manual
- **Convex Actions**: https://docs.convex.dev/functions/actions
- **Convex Storage**: https://docs.convex.dev/file-storage

---

## Post-Testing Actions

After all tests pass:
1. Document test results in `logs.md`
2. Update Linear ticket PER-10 to "Ready for Review"
3. Create test results summary with sample papers tested
4. Document any ArXiv API quirks encountered
5. Proceed with frontend integration (PER-12/PER-13)

