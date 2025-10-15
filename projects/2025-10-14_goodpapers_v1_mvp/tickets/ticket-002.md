# Ticket-002: PER-9 Testing & Validation

**Ticket**: PER-9 - Backend Schema & Core Functions Testing  
**Status**: Proposed (Awaiting Approval)  
**Created**: 2025-10-14  
**Estimated Time**: 45 minutes  
**Dependencies**: PER-8 complete

---

## Objective

Comprehensive testing and validation of PER-9 (Backend Schema & Core Functions) to ensure all Convex schemas, queries, mutations, and indexes are correctly defined, performant, and meeting specification requirements.

---

## Test Coverage Areas

### 1. Schema Definition (6 tests)
### 2. Query Functions (8 tests)
### 3. Mutation Functions (10 tests)
### 4. Search & Indexes (5 tests)
### 5. Data Validation (6 tests)
### 6. Performance & Edge Cases (5 tests)

**Total: 40 automated tests**

---

## Detailed Test Plan

### 1. Schema Definition (6 tests)

#### Test 1.1: Papers Schema Structure
**Type**: Schema Test  
**File**: `convex/schema.ts`  
**Success Criteria**:
- `papers` table defined with all required fields
- Fields: title, authors, abstract, arxivId, arxivUrl, pdfUrl, publishedDate
- Fields: userId, readingStatus, tags, pdfStorageId
- Fields: createdAt, updatedAt
- All field types correct (strings, arrays, ids, numbers)

#### Test 1.2: Papers Schema Indexes
**Type**: Index Test  
**Success Criteria**:
- `by_user` index exists on userId
- `by_user_updated` compound index on userId + updatedAt
- `by_arxiv_id` index exists
- `search_papers` search index exists with correct fields

#### Test 1.3: Notes Schema Structure
**Type**: Schema Test  
**Success Criteria**:
- `notes` table defined with all required fields
- Fields: paperId, userId, content (markdown), createdAt, updatedAt
- All field types correct

#### Test 1.4: Notes Schema Indexes
**Type**: Index Test  
**Success Criteria**:
- `by_paper` index exists on paperId
- `by_user` index exists on userId

#### Test 1.5: Users Schema Structure
**Type**: Schema Test  
**Success Criteria**:
- `users` table defined for multi-user support
- Fields: name, email, image, emailVerified, createdAt
- All fields optional except createdAt

#### Test 1.6: Schema Compilation
**Type**: Build Test  
**Command**: `npx convex dev --once`  
**Success Criteria**:
- Schema compiles without errors
- `convex/_generated/dataModel.d.ts` created
- TypeScript types generated correctly

---

### 2. Query Functions (8 tests)

#### Test 2.1: listRecentPapers Query
**Type**: Function Test  
**Test in Convex Dashboard**:
```json
{
  "userId": "<test_user_id>",
  "limit": 10
}
```
**Success Criteria**:
- Returns array of papers
- Papers sorted by updatedAt (most recent first)
- Respects limit parameter
- Returns only papers for specified userId

#### Test 2.2: listRecentPapers with Custom Limit
**Type**: Function Test  
**Test**: Call with limit=5
**Success Criteria**:
- Returns exactly 5 papers (or fewer if less exist)
- Ordering correct

#### Test 2.3: listPapers Query (No Filters)
**Type**: Function Test  
**Success Criteria**:
- Returns all papers for userId
- Sorted by updatedAt descending

#### Test 2.4: listPapers with Status Filter
**Type**: Function Test  
**Test**: Filter by readingStatus="reading"
**Success Criteria**:
- Returns only papers with "reading" status
- Other statuses excluded

#### Test 2.5: listPapers with Tag Filter
**Type**: Function Test  
**Test**: Filter by tag="machine-learning"
**Success Criteria**:
- Returns only papers with specified tag
- Papers without tag excluded

#### Test 2.6: getPaper by ID
**Type**: Function Test  
**Success Criteria**:
- Returns correct paper when ID valid
- Returns null when ID invalid
- All fields present in response

#### Test 2.7: getPaperByArxivId
**Type**: Function Test  
**Test**: Query with arxivId="2301.12345"
**Success Criteria**:
- Returns paper if exists for user
- Returns null if doesn't exist
- Checks both arxivId AND userId

#### Test 2.8: searchPapers Query
**Type**: Search Test  
**Test**: Search for "attention"
**Success Criteria**:
- Returns relevant papers
- Search works across titles
- Results limited to 20
- Only returns user's papers

---

### 3. Mutation Functions (10 tests)

#### Test 3.1: createPaper Success
**Type**: Mutation Test  
**Test Data**:
```json
{
  "userId": "<test_user_id>",
  "title": "Test Paper",
  "authors": ["Author 1", "Author 2"],
  "abstract": "Test abstract",
  "arxivId": "2301.12345",
  "arxivUrl": "https://arxiv.org/abs/2301.12345",
  "pdfUrl": "https://arxiv.org/pdf/2301.12345.pdf"
}
```
**Success Criteria**:
- Returns paperId
- Paper created in database
- Default readingStatus is "to_read"
- Default tags is empty array
- createdAt and updatedAt set

#### Test 3.2: createPaper Duplicate Prevention
**Type**: Error Handling Test  
**Test**: Try to create same paper twice (same arxivId + userId)
**Success Criteria**:
- Second attempt throws error
- Error message: "Paper with ArXiv ID X already exists"
- Database has only one entry

#### Test 3.3: updatePaper Reading Status
**Type**: Mutation Test  
**Test**: Update readingStatus to "completed"
**Success Criteria**:
- Paper updated successfully
- readingStatus changed
- updatedAt timestamp updated
- Other fields unchanged

#### Test 3.4: updatePaper Tags
**Type**: Mutation Test  
**Test**: Add tags ["ml", "nlp"]
**Success Criteria**:
- Tags array updated
- updatedAt timestamp updated

#### Test 3.5: updatePaper Multiple Fields
**Type**: Mutation Test  
**Test**: Update both status and tags
**Success Criteria**:
- Both fields updated
- Single updatedAt timestamp

#### Test 3.6: deletePaper Success
**Type**: Mutation Test  
**Test**: Delete a paper
**Success Criteria**:
- Paper removed from database
- Returns success: true
- Associated notes also deleted

#### Test 3.7: deletePaper Cascade
**Type**: Cascade Test  
**Setup**: Create paper with note, then delete paper
**Success Criteria**:
- Paper deleted
- Note also deleted (cascade)
- No orphaned notes

#### Test 3.8: saveNote Create New
**Type**: Mutation Test  
**Test**: Create note for paper without existing note
**Success Criteria**:
- Note created
- Returns noteId
- Content stored correctly (markdown)
- Timestamps set

#### Test 3.9: saveNote Update Existing
**Type**: Mutation Test  
**Test**: Update note for paper with existing note
**Success Criteria**:
- Existing note updated (not new created)
- Content replaced
- updatedAt changed
- createdAt unchanged

#### Test 3.10: deleteNote Success
**Type**: Mutation Test  
**Success Criteria**:
- Note deleted
- Returns success: true

---

### 4. Search & Indexes (5 tests)

#### Test 4.1: Search Index Performance
**Type**: Performance Test  
**Test**: Search with common term
**Success Criteria**:
- Results return in < 1 second
- Search uses index (not full scan)

#### Test 4.2: Search Relevance
**Type**: Relevance Test  
**Test**: Search for exact paper title
**Success Criteria**:
- Matching paper appears in results
- Results ordered by relevance
- No irrelevant papers

#### Test 4.3: Search with No Results
**Type**: Edge Case Test  
**Test**: Search for non-existent term
**Success Criteria**:
- Returns empty array (not error)
- Query executes successfully

#### Test 4.4: Index Usage Verification
**Type**: Query Plan Test  
**Success Criteria**:
- Queries use indexes (check Convex dashboard metrics)
- No full table scans on indexed queries
- Performance acceptable

#### Test 4.5: Search User Isolation
**Type**: Security Test  
**Test**: Search should only return current user's papers
**Success Criteria**:
- User A cannot see User B's papers
- Search filter on userId works correctly

---

### 5. Data Validation (6 tests)

#### Test 5.1: Required Field Validation
**Type**: Validation Test  
**Test**: Try to create paper without required field (e.g., title)
**Success Criteria**:
- Mutation fails with validation error
- Clear error message
- No partial data created

#### Test 5.2: Reading Status Enum
**Type**: Type Test  
**Test**: Try to set invalid readingStatus
**Success Criteria**:
- Only accepts: "to_read", "reading", "completed"
- Rejects other values
- Type error before runtime

#### Test 5.3: Array Field Types
**Type**: Type Test  
**Test**: Verify authors and tags are arrays
**Success Criteria**:
- Arrays store correctly
- Can be empty
- Elements are strings

#### Test 5.4: Optional Fields
**Type**: Validation Test  
**Test**: Create paper without optional fields
**Success Criteria**:
- publishedDate optional works
- pdfStorageId optional works
- No errors

#### Test 5.5: ID References Valid
**Type**: Relationship Test  
**Test**: Create note with invalid paperId
**Success Criteria**:
- Clear error message
- No orphaned data

#### Test 5.6: Timestamp Consistency
**Type**: Data Test  
**Test**: Check createdAt and updatedAt
**Success Criteria**:
- Both set on creation
- updatedAt changes on update
- createdAt never changes

---

### 6. Performance & Edge Cases (5 tests)

#### Test 6.1: Large Result Sets
**Type**: Performance Test  
**Test**: User with 100+ papers
**Success Criteria**:
- Queries still fast (< 2 seconds)
- Pagination works if needed
- No memory issues

#### Test 6.2: Empty State
**Type**: Edge Case Test  
**Test**: Query for new user with no papers
**Success Criteria**:
- Returns empty array
- No errors
- Fast response

#### Test 6.3: Concurrent Mutations
**Type**: Concurrency Test  
**Test**: Update same paper twice simultaneously
**Success Criteria**:
- Both mutations succeed
- Final state is consistent
- No race conditions

#### Test 6.4: Very Long Content
**Type**: Edge Case Test  
**Test**: Note with 10,000+ characters
**Success Criteria**:
- Saves successfully
- Retrieves correctly
- No truncation

#### Test 6.5: Special Characters
**Type**: Edge Case Test  
**Test**: Paper title with unicode, emojis, etc.
**Success Criteria**:
- Stores correctly
- Retrieves correctly
- Search works

---

## Test Execution Order

### Phase 1: Schema Validation (10 min)
1. Schema structure tests (1.1-1.5)
2. Schema compilation test (1.6)
3. Index verification (1.2, 1.4)

### Phase 2: Query Testing (15 min)
4. All query function tests (2.1-2.8)
5. Search functionality tests (4.1-4.5)

### Phase 3: Mutation Testing (15 min)
6. Create/Update/Delete tests (3.1-3.10)
7. Data validation tests (5.1-5.6)

### Phase 4: Performance & Edge Cases (5 min)
8. Performance tests (6.1-6.5)

---

## Test Automation Script

```bash
#!/bin/bash
# test-per-9.sh

set -e

echo "🧪 PER-9 Testing Suite: Backend Schema & Functions"
echo "=================================================="

# Phase 1: Schema Validation
echo ""
echo "Phase 1: Schema Validation"
echo "-------------------------"

echo "✓ Checking schema files exist..."
test -f "convex/schema.ts" && echo "  ✓ schema.ts exists"
test -f "convex/papers.ts" && echo "  ✓ papers.ts exists"
test -f "convex/notes.ts" && echo "  ✓ notes.ts exists"

echo "✓ Compiling schema..."
cd goodpapers
npx convex dev --once && echo "  ✓ Schema compiled successfully"

echo "✓ Checking generated types..."
test -f "convex/_generated/dataModel.d.ts" && echo "  ✓ dataModel.d.ts generated"
test -f "convex/_generated/api.d.ts" && echo "  ✓ api.d.ts generated"

# Phase 2: Type Checking
echo ""
echo "Phase 2: Type Checking"
echo "---------------------"
npx tsc --noEmit && echo "  ✓ No type errors"

echo ""
echo "✅ Automated tests passed!"
echo ""
echo "🔍 Next: Manual testing in Convex Dashboard required"
echo "   1. Go to: https://dashboard.convex.dev"
echo "   2. Select project: impartial-wolf-773"
echo "   3. Navigate to Functions tab"
echo "   4. Test queries and mutations with sample data"
```

---

## Manual Test Checklist

### Convex Dashboard Testing

**Setup**:
- [ ] Navigate to https://dashboard.convex.dev
- [ ] Select project: impartial-wolf-773
- [ ] Go to Data tab
- [ ] Create test user manually

**Query Tests**:
- [ ] Test `papers.listRecentPapers` with test userId
- [ ] Test `papers.searchPapers` with query
- [ ] Test `papers.getPaper` with valid/invalid ID
- [ ] Test `papers.getPaperByArxivId` for duplicate check
- [ ] Test `notes.getNotesByPaper` with paper ID

**Mutation Tests**:
- [ ] Test `papers.createPaper` with valid data
- [ ] Test duplicate prevention (create same paper twice)
- [ ] Test `papers.updatePaper` (status and tags)
- [ ] Test `papers.deletePaper` (verify cascade)
- [ ] Test `notes.saveNote` (create new)
- [ ] Test `notes.saveNote` (update existing)
- [ ] Test `notes.deleteNote`

**Performance Tests**:
- [ ] Create 10+ test papers
- [ ] Test search performance
- [ ] Test list query performance
- [ ] Verify index usage in dashboard metrics

---

## Success Criteria Summary

### Automated Tests (15 tests)
- [ ] Schema structure tests pass (6/6)
- [ ] Schema compilation passes
- [ ] TypeScript type checking passes
- [ ] All files exist and in correct locations

### Manual Convex Dashboard Tests (25 tests)
- [ ] All query functions work correctly (8/8)
- [ ] All mutation functions work correctly (10/10)
- [ ] Search and indexes perform well (5/5)
- [ ] Data validation works (6/6)
- [ ] Edge cases handled (5/5)

---

## Expected Test Duration

- **Automated tests**: 10 minutes
- **Manual dashboard tests**: 30 minutes
- **Documentation**: 5 minutes
- **Total**: 45 minutes

---

## Test Output Format

Each manual test should be documented:
```
[TEST NAME]
Input: {test data}
Expected: {expected result}
Actual: {actual result}
Status: PASS/FAIL
Notes: {any observations}
```

---

## Failure Handling

If any test fails:
1. **Document the failure** with full details
2. **Check schema definition** for correctness
3. **Verify function logic** matches spec
4. **Fix the issue** in code
5. **Re-run full test suite** to ensure no regressions
6. **Update logs.md** with findings

---

## References

- **Spec**: `/projects/2025-10-14_goodpapers_v1_mvp/spec.md`
- **PER-9 Plan**: `/projects/2025-10-14_goodpapers_v1_mvp/PER-9_execution_plan.md`
- **Convex Schema Docs**: https://docs.convex.dev/database/schemas
- **Convex Dashboard**: https://dashboard.convex.dev

---

## Post-Testing Actions

After all tests pass:
1. Document test results in `logs.md`
2. Update Linear ticket PER-9 to "Ready for Review"
3. Create test results summary
4. Proceed with PER-10 testing or frontend development

