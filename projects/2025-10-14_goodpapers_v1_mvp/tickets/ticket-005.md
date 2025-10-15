# Ticket-005: PER-12 Testing & Validation

**Ticket**: PER-12 - Home Page with Search & Paper List Testing  
**Status**: Proposed (Awaiting Approval)  
**Created**: 2025-10-15  
**Estimated Time**: 30 minutes  
**Dependencies**: PER-8, PER-9, PER-10, PER-11 complete

---

## Objective

Comprehensive testing and validation of PER-12 (Home Page with Search & Paper List) to ensure paper display, add paper functionality, search capabilities, and reading status filters all work correctly and meet specification requirements.

---

## Test Coverage Areas

### 1. Paper List Display (7 tests)
### 2. Add Paper Functionality (9 tests)
### 3. Search Functionality (6 tests)
### 4. Reading Status Filters (5 tests)
### 5. UI/UX & Integration (8 tests)

**Total: 35 automated + manual tests**

---

## Detailed Test Plan

### 1. Paper List Display (7 tests)

#### Test 1.1: Empty State Display
**Type**: Visual Test (Browser MCP)  
**Steps**:
1. Start with no papers in database
2. Navigate to homepage
3. Verify empty state displays

**Success Criteria**:
- Empty state message displays
- Message encourages adding first paper
- "Add Paper" button visible and accessible
- Professional appearance

#### Test 1.2: Single Paper Display
**Type**: Visual Test  
**Steps**:
1. Add one paper to database
2. Navigate to homepage
3. Verify paper displays correctly

**Success Criteria**:
- Paper card renders with all metadata
- Title displays (no truncation if short)
- Authors display correctly
- Status badge shows correct status
- Tags display (if any)
- Abstract preview visible

#### Test 1.3: Multiple Papers Display
**Type**: Visual Test  
**Steps**:
1. Add 10+ papers to database
2. Navigate to homepage
3. Verify grid layout

**Success Criteria**:
- Papers display in grid (1 column mobile, 2-3 columns desktop)
- Grid responsive to screen size
- Proper spacing between cards
- All cards have consistent styling

#### Test 1.4: Paper Card Click Navigation
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click on a paper card
2. Verify navigation to detail page

**Success Criteria**:
- Navigates to `/paper/{paperId}`
- URL updates correctly
- Paper detail page loads (even if placeholder)

#### Test 1.5: Paper Metadata Display
**Type**: Visual Test  
**Steps**:
1. Verify all metadata fields display correctly

**Success Criteria**:
- Title (line-clamp-2 for long titles)
- Authors (line-clamp-1)
- Status badge with correct color
- Tags (show first 3, "+N" for more)
- Abstract preview (line-clamp-2)

#### Test 1.6: Paper List Loading State
**Type**: UX Test  
**Steps**:
1. Clear browser cache
2. Navigate to homepage
3. Observe loading state

**Success Criteria**:
- Skeleton loaders display during query
- Smooth transition to actual content
- No layout shift
- Professional loading animation

#### Test 1.7: Real-Time Updates
**Type**: Integration Test  
**Steps**:
1. Open homepage in browser
2. Add paper via Add Paper modal
3. Verify paper appears without manual refresh

**Success Criteria**:
- New paper appears automatically
- No page refresh needed
- List updates smoothly
- Correct sort order maintained

---

### 2. Add Paper Functionality (9 tests)

#### Test 2.1: Add Paper Button Visibility
**Type**: Visual Test  
**Steps**:
1. Navigate to homepage
2. Locate "Add Paper" button

**Success Criteria**:
- Button visible in header or main area
- Clear call-to-action
- Accessible via keyboard (Tab)
- Proper styling and hover state

#### Test 2.2: Add Paper Modal Open/Close
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click "Add Paper" button
2. Modal opens
3. Click Cancel or outside modal
4. Modal closes

**Success Criteria**:
- Modal opens on button click
- Modal displays centered on screen
- Modal closes on Cancel click
- Modal closes on outside click (optional)
- Focus trapped in modal (optional)

#### Test 2.3: Add Paper with Valid ArXiv URL
**Type**: Integration Test (Browser MCP)  
**Steps**:
1. Open Add Paper modal
2. Enter valid ArXiv URL: `https://arxiv.org/abs/1706.03762`
3. Submit form

**Success Criteria**:
- Loading indicator shows
- Modal stays open during fetch (or closes after submit)
- Paper added to database
- Paper appears in list
- Modal closes on success
- Success message (optional)

#### Test 2.4: Add Paper with ArXiv ID
**Type**: Integration Test  
**Steps**:
1. Open Add Paper modal
2. Enter just ArXiv ID: `2301.12345`
3. Submit form

**Success Criteria**:
- Accepts bare ArXiv ID (not just URL)
- Fetches metadata correctly
- Paper added successfully

#### Test 2.5: Add Paper with Invalid URL
**Type**: Error Test (Browser MCP)  
**Steps**:
1. Open Add Paper modal
2. Enter invalid URL: `not-a-valid-url`
3. Submit form

**Success Criteria**:
- Error message displays
- Error message is clear and helpful
- Modal stays open for correction
- Can retry with valid URL

#### Test 2.6: Add Paper with Non-Existent ArXiv ID
**Type**: Error Test  
**Steps**:
1. Open Add Paper modal
2. Enter non-existent ID: `9999.99999`
3. Submit form

**Success Criteria**:
- Error message: "Paper not found"
- Modal stays open
- Can retry with different URL

#### Test 2.7: Add Duplicate Paper
**Type**: Error Test  
**Steps**:
1. Add paper successfully
2. Try to add same paper again

**Success Criteria**:
- Error or message: "Paper already exists"
- Doesn't create duplicate in database
- Can close modal

#### Test 2.8: Add Paper Loading State
**Type**: UX Test  
**Steps**:
1. Open Add Paper modal
2. Enter valid ArXiv URL
3. Submit form
4. Observe loading state

**Success Criteria**:
- Button changes to "Adding..." or shows spinner
- Button disabled during loading
- Input disabled during loading
- Can't submit again during loading

#### Test 2.9: Add Paper Performance
**Type**: Performance Test  
**Steps**:
1. Time the complete add paper flow
2. From button click to paper appearing in list

**Success Criteria**:
- Total time < 15 seconds (spec requirement)
- Fetch metadata: < 5s
- Download PDF: < 8s
- Update UI: < 2s
- User perceives progress (loading indicators)

---

### 3. Search Functionality (6 tests)

#### Test 3.1: Search Bar Rendering
**Type**: Visual Test  
**Steps**:
1. Navigate to homepage
2. Locate search bar

**Success Criteria**:
- Search bar visible at top of page
- Placeholder text: "Search papers..."
- Search icon visible
- Clear button appears when text entered

#### Test 3.2: Search by Title
**Type**: Search Test (Browser MCP)  
**Steps**:
1. Add paper with title containing "Transformer"
2. Type "Transformer" in search bar
3. Verify paper appears

**Success Criteria**:
- Paper with matching title appears
- Other papers hidden
- Search is case-insensitive
- Results update in real-time (no submit button)

#### Test 3.3: Search by Author
**Type**: Search Test  
**Steps**:
1. Add paper with author "Vaswani"
2. Type "Vaswani" in search bar

**Success Criteria**:
- Paper with matching author appears
- Search across authors array works
- Partial matches work

#### Test 3.4: Search by Abstract
**Type**: Search Test  
**Steps**:
1. Add paper with "attention mechanism" in abstract
2. Type "attention" in search bar

**Success Criteria**:
- Paper appears in results
- Abstract search works
- Partial word matching

#### Test 3.5: Clear Search
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Enter search query
2. Click clear button (X icon)

**Success Criteria**:
- Search input clears
- All papers display again
- Clear button disappears

#### Test 3.6: Search Performance
**Type**: Performance Test  
**Steps**:
1. Add 50+ papers
2. Search for specific term
3. Measure response time

**Success Criteria**:
- Search results appear < 1 second (spec requirement)
- No UI lag while typing
- Debouncing prevents excessive queries

---

### 4. Reading Status Filters (5 tests)

#### Test 4.1: Filter Tabs Display
**Type**: Visual Test  
**Steps**:
1. Navigate to homepage
2. Locate status filter tabs

**Success Criteria**:
- Tabs visible: "All Papers", "To Read", "Reading", "Completed"
- Clear visual distinction for active tab
- Accessible via keyboard

#### Test 4.2: Filter by "To Read"
**Type**: Filter Test (Browser MCP)  
**Steps**:
1. Add papers with mixed statuses
2. Click "To Read" tab

**Success Criteria**:
- Only "to_read" papers display
- Other papers hidden
- Tab shows as active
- Paper count correct

#### Test 4.3: Filter by "Reading"
**Type**: Filter Test  
**Steps**:
1. Click "Reading" tab

**Success Criteria**:
- Only "reading" papers display
- Filter works correctly

#### Test 4.4: Filter by "Completed"
**Type**: Filter Test  
**Steps**:
1. Click "Completed" tab

**Success Criteria**:
- Only "completed" papers display
- Filter works correctly

#### Test 4.5: Clear Filter (All Papers)
**Type**: Filter Test  
**Steps**:
1. Click "All Papers" tab

**Success Criteria**:
- All papers display regardless of status
- Filter cleared

---

### 5. UI/UX & Integration (8 tests)

#### Test 5.1: Homepage Layout
**Type**: Visual Test  
**Steps**:
1. Navigate to homepage
2. Verify layout structure

**Success Criteria**:
- Header with logo and user menu (from PER-11)
- Page title: "Your Papers"
- Add Paper button prominent
- Search bar accessible
- Status filter tabs clear
- Paper grid organized

#### Test 5.2: Empty State with No Search Results
**Type**: UX Test (Browser MCP)  
**Steps**:
1. Search for term with no matches

**Success Criteria**:
- Empty state displays
- Message: "No papers found"
- Suggests trying different search
- Clear button to reset search

#### Test 5.3: Responsive Design - Desktop
**Type**: Responsive Test (Browser MCP)  
**Steps**:
1. Resize to desktop width (1920px)
2. Verify grid layout

**Success Criteria**:
- 3-column grid for papers
- Proper spacing and margins
- Content max-width centered
- Professional appearance

#### Test 5.4: Responsive Design - Mobile
**Type**: Responsive Test (Browser MCP)  
**Steps**:
1. Resize to mobile width (375px)
2. Verify mobile layout

**Success Criteria**:
- 1-column grid for papers
- Search bar full-width
- Add Paper button accessible
- Status tabs scrollable/stacked
- Readable on small screens

#### Test 5.5: Paper Card Hover States
**Type**: Interaction Test  
**Steps**:
1. Hover over paper card

**Success Criteria**:
- Card shadow increases on hover
- Border color changes
- Smooth transition
- Cursor becomes pointer

#### Test 5.6: Goodreads-Inspired Aesthetic
**Type**: Visual Test  
**Steps**:
1. Compare to Goodreads design
2. Verify similar aesthetic

**Success Criteria**:
- Similar color palette
- Similar card design
- Professional appearance
- Clean typography

#### Test 5.7: Real-Time Paper Updates
**Type**: Integration Test  
**Steps**:
1. Open homepage in Browser 1
2. Add paper via modal
3. Verify paper appears in Browser 1 without refresh

**Success Criteria**:
- Real-time update works
- No manual refresh needed
- Smooth animation (optional)

#### Test 5.8: Performance Under Load
**Type**: Performance Test  
**Steps**:
1. Add 100 papers to database
2. Navigate to homepage
3. Measure load time

**Success Criteria**:
- Page loads < 2 seconds (spec requirement)
- Scrolling is smooth
- No UI lag
- Search still performant

---

## Test Execution Order

### Phase 1: Component Rendering (10 min)
1. Homepage layout (5.1)
2. Empty state (1.1)
3. Search bar rendering (3.1)
4. Filter tabs (4.1)

### Phase 2: Add Paper Flow (12 min)
5. Add Paper button and modal (2.1, 2.2)
6. Add paper with valid URL (2.3)
7. Add paper with ID (2.4)
8. Add paper errors (2.5, 2.6, 2.7)
9. Loading states (2.8)
10. Performance (2.9)

### Phase 3: Paper Display (8 min)
11. Single paper (1.2)
12. Multiple papers (1.3)
13. Paper card navigation (1.4)
14. Paper metadata (1.5)
15. Loading state (1.6)
16. Real-time updates (1.7)

### Phase 4: Search & Filters (10 min)
17. Search by title (3.2)
18. Search by author (3.3)
19. Search by abstract (3.4)
20. Clear search (3.5)
21. Search performance (3.6)
22. Status filters (4.2-4.5)

### Phase 5: UI/UX Validation (10 min)
23. Responsive design (5.3, 5.4)
24. Hover states (5.5)
25. Goodreads aesthetic (5.6)
26. Real-time updates (5.7)
27. Performance under load (5.8)

---

## Test Automation Script

```bash
#!/bin/bash
# test-per-12.sh

set -e

echo "🧪 PER-12 Testing Suite: Home Page with Search & Paper List"
echo "=========================================================="

cd goodpapers

# Phase 1: File Structure
echo ""
echo "Phase 1: File Structure"
echo "----------------------"

echo "✓ Checking component files..."
test -f "components/papers/PaperCard.tsx" && echo "  ✓ PaperCard.tsx exists"
test -f "components/papers/PaperList.tsx" && echo "  ✓ PaperList.tsx exists"
test -f "components/papers/SearchBar.tsx" && echo "  ✓ SearchBar.tsx exists"
test -f "components/papers/StatusFilter.tsx" && echo "  ✓ StatusFilter.tsx exists"
test -f "components/papers/AddPaperModal.tsx" && echo "  ✓ AddPaperModal.tsx exists"

# Phase 2: Type Checking
echo ""
echo "Phase 2: Type Checking"
echo "---------------------"
npx tsc --noEmit && echo "  ✓ No type errors"

# Phase 3: Build Verification
echo ""
echo "Phase 3: Build Verification"
echo "---------------------------"
npm run build && echo "  ✓ Production build succeeds"

# Phase 4: Component Validation
echo ""
echo "Phase 4: Component Validation"
echo "-----------------------------"
grep -q "PaperCard" "components/papers/PaperList.tsx" && echo "  ✓ PaperCard imported in PaperList"
grep -q "useQuery" "components/papers/PaperList.tsx" && echo "  ✓ Convex query used"
grep -q "useMutation" "components/papers/AddPaperModal.tsx" && echo "  ✓ Add paper action used"
grep -q "SearchBar" "app/page.tsx" && echo "  ✓ SearchBar integrated"

echo ""
echo "✅ Automated tests passed!"
echo ""
echo "🔍 Next: Manual testing in browser required"
echo "   1. Start dev server: npm run dev"
echo "   2. Navigate to: http://localhost:3000"
echo "   3. Test add paper flow"
echo "   4. Test search functionality"
echo "   5. Test status filters"
```

---

## Manual Test Checklist

### Homepage Testing (Browser MCP)

**Setup**:
- [ ] Start dev server: `npm run dev`
- [ ] Open browser to http://localhost:3000
- [ ] Sign in with Google (if auth enabled)
- [ ] Open browser console (check for errors)

**Empty State**:
- [ ] Homepage shows empty state when no papers
- [ ] "Add Paper" button is visible
- [ ] Empty state message is helpful
- [ ] Professional appearance

**Add Paper Flow**:
- [ ] Click "Add Paper" button
- [ ] Modal opens and displays correctly
- [ ] Enter valid ArXiv URL (e.g., https://arxiv.org/abs/1706.03762)
- [ ] Submit form
- [ ] Loading indicator shows
- [ ] Paper fetched successfully (< 15s)
- [ ] Paper appears in list
- [ ] Modal closes automatically

**Paper Display**:
- [ ] Paper card displays all metadata
- [ ] Title, authors, abstract visible
- [ ] Status badge shows correct color
- [ ] Tags display if present
- [ ] Hover effect works on card
- [ ] Click card navigates to detail page

**Search Functionality**:
- [ ] Search bar is visible and accessible
- [ ] Type in search query
- [ ] Results filter in real-time
- [ ] Search works across title, authors, abstract
- [ ] Clear button clears search
- [ ] No search delays or lag

**Status Filters**:
- [ ] Filter tabs are visible
- [ ] Click "To Read" → shows only to_read papers
- [ ] Click "Reading" → shows only reading papers
- [ ] Click "Completed" → shows only completed papers
- [ ] Click "All Papers" → shows all papers
- [ ] Active tab highlighted correctly

**Responsive Design**:
- [ ] Resize to mobile (375px) → single column grid
- [ ] Resize to tablet (768px) → 2 column grid
- [ ] Resize to desktop (1920px) → 3 column grid
- [ ] All controls accessible on mobile
- [ ] No horizontal scroll

---

## Convex Dashboard Testing

**Setup**:
- [ ] Navigate to https://dashboard.convex.dev
- [ ] Select project: impartial-wolf-773
- [ ] Go to Data tab

**Paper Creation Test**:
- [ ] Add paper via Add Paper modal
- [ ] Check Data → papers table
- [ ] Verify new paper record created with:
  - title (from ArXiv)
  - authors (from ArXiv)
  - abstract (from ArXiv)
  - arxivId
  - pdfStorageId
  - readingStatus: "to_read" (default)
  - tags: [] (empty array)
  - createdAt, updatedAt timestamps

**Storage Test**:
- [ ] Check Data → _storage table
- [ ] Verify PDF file stored
- [ ] File size reasonable (1-10 MB for papers)

---

## Test Scenarios with Expected Results

### Scenario 1: First-Time User Experience
**Steps**:
1. Sign in for first time
2. Homepage shows empty state
3. Click "Add Paper"
4. Enter "Attention Is All You Need" paper: `https://arxiv.org/abs/1706.03762`
5. Submit

**Expected Result**:
```
1. Homepage loads with empty state ✓
2. "Add Paper" button visible ✓
3. Modal opens ✓
4. ArXiv URL entered ✓
5. Paper fetches (~10-15s) ✓
6. Paper appears in grid ✓
7. Card shows: "Attention Is All You Need", authors, abstract ✓
8. Status: "To Read" badge ✓
```

### Scenario 2: Search and Filter Workflow
**Steps**:
1. Add 5 papers with different titles
2. Search for specific keyword
3. Filter by "Reading" status
4. Clear search
5. View all papers

**Expected Result**:
```
1. 5 papers appear in grid ✓
2. Search filters to matching papers only ✓
3. Filter shows only "reading" papers ✓
4. Clear button resets to all papers ✓
5. All 5 papers visible again ✓
```

### Scenario 3: Error Handling
**Steps**:
1. Try to add invalid ArXiv ID
2. Try to add duplicate paper

**Expected Result**:
```
1. Invalid ID shows error: "Invalid ArXiv URL or ID format" ✓
2. Duplicate shows error: "Paper already exists" ✓
3. Can retry with valid input ✓
4. Modal stays open for correction ✓
```

---

## Browser MCP Test Commands

### Test 1: Homepage Empty State
```typescript
browser.navigate("http://localhost:3000");
browser.snapshot();
// Verify: "Add Paper" button exists
// Verify: Empty state message
```

### Test 2: Add Paper Flow
```typescript
browser.click({ element: "Add Paper button", ref: "<ref>" });
browser.type({
  element: "ArXiv URL input",
  ref: "<ref>",
  text: "https://arxiv.org/abs/1706.03762",
  submit: true
});
browser.waitFor({ text: "Attention Is All You Need", time: 15 });
browser.snapshot();
// Verify: Paper card appears
```

### Test 3: Search Functionality
```typescript
browser.type({
  element: "Search input",
  ref: "<ref>",
  text: "Transformer"
});
browser.snapshot();
// Verify: Filtered results
```

### Test 4: Status Filters
```typescript
browser.click({ element: "To Read tab", ref: "<ref>" });
browser.snapshot();
// Verify: Only to_read papers visible
```

---

## Success Criteria Summary

### Automated Tests (8 tests)
- [ ] File structure tests pass
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Component imports validated

### Manual Browser Tests (27 tests)
- [ ] Paper list works (7/7)
- [ ] Add paper works (9/9)
- [ ] Search works (6/6)
- [ ] Filters work (5/5)
- [ ] UI/UX polished (8/8)

---

## Expected Test Duration

- **Automated tests**: 5 minutes
- **Manual homepage tests**: 8 minutes
- **Add paper tests**: 7 minutes
- **Search & filter tests**: 5 minutes
- **UI/UX validation**: 5 minutes
- **Total**: 30 minutes

---

## Performance Benchmarks

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Homepage load | < 2s | Browser DevTools → Network |
| Add paper (total) | < 15s | Stopwatch from submit to list update |
| Search results | < 1s | Visual observation during typing |
| Paper card click | < 500ms | Time to detail page load |

---

## Test Exit Criteria

**All tests must pass** before proceeding to PER-13:

✅ **Paper List**:
- Papers display in grid layout
- All metadata visible
- Loading states work
- Empty state helpful

✅ **Add Paper**:
- Modal works correctly
- ArXiv integration successful
- Errors handled gracefully
- Real-time updates work

✅ **Search & Filters**:
- Search finds papers quickly
- Filters work correctly
- Clear actions function
- Performance acceptable

✅ **UI/UX**:
- Professional appearance
- Responsive design works
- Goodreads-inspired aesthetic
- No console errors

---

## Next Steps After PER-12

Once PER-12 is complete and tested:

1. **PER-13**: Paper Detail Page with PDF Viewer & Notes
   - PDF viewing with react-pdf
   - Notes editor with auto-save
   - Metadata display and editing

2. **PER-14**: Polish & Deploy
   - UI refinements
   - Loading state improvements
   - Production deployment

---

**Testing Focus**: Paper management workflow must be intuitive and fast! 📚

