# Ticket-006: PER-13 Testing & Validation

**Ticket**: PER-13 - Paper Detail Page with PDF Viewer & Notes Testing  
**Status**: Proposed (Awaiting Approval)  
**Created**: 2025-10-15  
**Estimated Time**: 45 minutes  
**Dependencies**: PER-8, PER-9, PER-10, PER-11, PER-12 complete

---

## Objective

Comprehensive testing and validation of PER-13 (Paper Detail Page with PDF Viewer & Notes) to ensure PDF viewing, note-taking, metadata display, reading status updates, and tags editing all work correctly and meet specification requirements.

---

## Test Coverage Areas

### 1. PDF Viewer Functionality (10 tests)
### 2. Notes Editor & Auto-Save (8 tests)
### 3. Paper Metadata Display (7 tests)
### 4. Reading Status & Tags (6 tests)
### 5. Layout & Integration (9 tests)

**Total: 40 automated + manual tests**

---

## Context from PER-12

### Current State (Post-PER-12)
- ✅ Paper list displays papers in grid
- ✅ Clicking paper card navigates to `/paper/{paperId}`
- ⚠️ **Currently shows 404** (expected - PER-13 not implemented yet)
- ✅ Mock authentication working with test user
- ✅ TinyTroupe paper in database (ID: `j97dx96r97y92wk24aw4z3362n7shyrz`)
- ✅ PDF stored in Convex Storage (pdfStorageId available)

### What PER-13 Will Enable
- ✅ **404 → Paper Detail Page**: Clicking paper will show PDF and notes instead of 404
- ✅ **PDF Viewing**: See the actual TinyTroupe PDF rendered in browser
- ✅ **Note Taking**: Add notes to papers with auto-save
- ✅ **Status Updates**: Change reading status (To Read → Reading → Completed)
- ✅ **Tags Management**: Add/remove tags to organize papers

### Available Test Data
- **Paper**: TinyTroupe (ID: `j97dx96r97y92wk24aw4z3362n7shyrz`)
- **User**: Test User (ID: `jd7b9a0m074jxjsxattq0cn74x7shyrz`)
- **PDF**: Stored in Convex Storage
- **ArXiv URL**: https://arxiv.org/abs/2507.09788

---

## Detailed Test Plan

### 1. PDF Viewer Functionality (10 tests)

#### Test 1.1: PDF Load from Storage
**Type**: Integration Test (Browser MCP)  
**Steps**:
1. Navigate to `/paper/j97dx96r97y92wk24aw4z3362n7shyrz`
2. Wait for PDF to load
3. Verify PDF renders

**Success Criteria**:
- PDF loads from Convex Storage via HTTP action
- First page of TinyTroupe paper displays
- Loading spinner shows during load
- PDF renders within 5 seconds (spec requirement)
- No CORS errors in console

#### Test 1.2: Page Navigation - Next/Previous
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click "Next" button
2. Verify page number increases
3. Click "Previous" button
4. Verify page returns to previous

**Success Criteria**:
- Page number updates correctly
- PDF re-renders with new page
- Previous disabled on page 1
- Next disabled on last page
- Page counter shows "Page X of Y"

#### Test 1.3: Page Navigation - Direct Input
**Type**: Interaction Test  
**Steps**:
1. Enter page number in input field
2. Press Enter or click Go
3. Verify PDF jumps to that page

**Success Criteria**:
- Can type page number
- PDF navigates to correct page
- Invalid page numbers handled gracefully
- Page counter updates

#### Test 1.4: Zoom Controls - Zoom In
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click "+" (zoom in) button multiple times
2. Observe PDF scaling

**Success Criteria**:
- PDF scales up incrementally
- Zoom percentage displays (e.g., "110%", "120%")
- Maximum zoom limit enforced (e.g., 200%)
- Button disables at max zoom
- PDF quality maintained at higher zoom

#### Test 1.5: Zoom Controls - Zoom Out
**Type**: Interaction Test  
**Steps**:
1. Click "−" (zoom out) button multiple times
2. Observe PDF scaling

**Success Criteria**:
- PDF scales down incrementally
- Minimum zoom limit enforced (e.g., 50%)
- Button disables at min zoom
- PDF remains readable

#### Test 1.6: Zoom Controls - Fit to Width
**Type**: Interaction Test  
**Steps**:
1. Click "Fit to Width" button
2. Verify PDF scales to container width

**Success Criteria**:
- PDF scales to fit container width
- No horizontal scroll
- Readable text size
- Resets zoom percentage

#### Test 1.7: PDF Viewer Loading State
**Type**: UX Test  
**Steps**:
1. Navigate to paper detail page
2. Observe loading state during PDF load

**Success Criteria**:
- Loading spinner displays
- Professional loading animation
- No blank screen
- Smooth transition to rendered PDF

#### Test 1.8: PDF Viewer Error Handling
**Type**: Error Test  
**Steps**:
1. Navigate to paper with invalid/missing PDF
2. Observe error handling

**Success Criteria**:
- Error message displays
- Message is user-friendly
- Suggests action (e.g., "Try re-downloading")
- Doesn't crash app

#### Test 1.9: PDF Scrolling & Navigation
**Type**: UX Test  
**Steps**:
1. Load multi-page PDF
2. Scroll through pages
3. Use page controls

**Success Criteria**:
- Smooth scrolling
- No lag or jank
- Page controls always visible
- Can navigate long papers (>10 pages)

#### Test 1.10: PDF Viewer Responsive Behavior
**Type**: Responsive Test (Browser MCP)  
**Steps**:
1. Resize browser window
2. Verify PDF viewer adapts

**Success Criteria**:
- PDF scales appropriately
- Controls remain accessible
- No horizontal overflow
- Readable on smaller screens (desktop-first focus)

---

### 2. Notes Editor & Auto-Save (8 tests)

#### Test 2.1: Notes Editor Rendering
**Type**: Visual Test  
**Steps**:
1. Navigate to paper detail page
2. Locate notes editor

**Success Criteria**:
- Text area visible and accessible
- Placeholder text: "Take notes on this paper..."
- Proper styling and sizing
- Cursor appears on focus

#### Test 2.2: Notes Auto-Save - Create Note
**Type**: Integration Test (Browser MCP)  
**Steps**:
1. Navigate to paper with no existing notes
2. Type text in notes editor
3. Wait for auto-save (1 second debounce)
4. Verify note created in database

**Success Criteria**:
- Typing updates textarea
- "Saving..." indicator appears
- Note created in database (check Convex dashboard)
- "Saved at {time}" displays after save
- No manual save button needed

#### Test 2.3: Notes Auto-Save - Update Note
**Type**: Integration Test (Browser MCP)  
**Steps**:
1. Navigate to paper with existing note
2. Modify text
3. Wait for auto-save
4. Verify note updated

**Success Criteria**:
- Existing note loads in editor
- Changes trigger auto-save
- Database updated correctly
- Timestamp updates

#### Test 2.4: Notes Auto-Save - Debouncing
**Type**: Performance Test  
**Steps**:
1. Type rapidly in notes editor
2. Observe save behavior

**Success Criteria**:
- Doesn't save on every keystroke
- Waits for typing pause (~1s)
- "Saving..." appears only once after pause
- No excessive database writes

#### Test 2.5: Notes Persistence
**Type**: Integration Test  
**Steps**:
1. Add notes to paper
2. Wait for auto-save
3. Navigate away (back to homepage)
4. Return to paper detail page

**Success Criteria**:
- Notes persist in database
- Notes load when returning to page
- Content unchanged
- No data loss

#### Test 2.6: Notes Loading State
**Type**: UX Test  
**Steps**:
1. Navigate to paper with existing notes
2. Observe loading behavior

**Success Criteria**:
- Notes load quickly (< 1s)
- No flash of empty textarea
- Smooth transition to content
- Cursor can be placed immediately

#### Test 2.7: Notes Character Limit
**Type**: Boundary Test  
**Steps**:
1. Type very long note (>10,000 characters)
2. Verify handling

**Success Criteria**:
- No character limit (or reasonable limit like 100k)
- Auto-save works with long notes
- No performance degradation
- Textarea scrolls properly

#### Test 2.8: Notes Error Handling
**Type**: Error Test  
**Steps**:
1. Simulate save failure (disconnect network)
2. Type notes
3. Observe error behavior

**Success Criteria**:
- Error message displays
- Note content preserved in textarea
- Can retry when connection restored
- No data loss

---

### 3. Paper Metadata Display (7 tests)

#### Test 3.1: Metadata Rendering
**Type**: Visual Test  
**Steps**:
1. Navigate to TinyTroupe paper detail page
2. Verify all metadata displays

**Success Criteria**:
- Title: "TinyTroupe: An LLM-powered Multiagent Persona Simulation Toolkit"
- Authors: "Paulo Salem, Robert Sim, Christopher Olsen..." (6 authors)
- Abstract: Full abstract visible
- ArXiv ID: 2507.09788
- Publication date displayed
- Status badge: "To Read"
- No tags (empty state)

#### Test 3.2: External ArXiv Link
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click "View on ArXiv" link
2. Verify opens correct URL

**Success Criteria**:
- Link opens in new tab
- URL: https://arxiv.org/abs/2507.09788
- Correct paper loads on ArXiv.org

#### Test 3.3: Reading Status Badge Display
**Type**: Visual Test  
**Steps**:
1. Verify status badge rendering

**Success Criteria**:
- Badge displays current status
- Color-coded (blue for "To Read")
- Matches PaperCard styling from PER-12
- Positioned prominently

#### Test 3.4: Tags Display - Empty State
**Type**: Visual Test  
**Steps**:
1. Verify tags section when no tags

**Success Criteria**:
- Tags section visible
- Shows placeholder or "No tags" message
- "Add tag" button/input visible
- Professional appearance

#### Test 3.5: Created/Updated Timestamps
**Type**: Visual Test  
**Steps**:
1. Verify timestamps display

**Success Criteria**:
- Created date shown
- Last updated shown (if different)
- Formatted as readable date (not Unix timestamp)
- Relative time optional (e.g., "2 hours ago")

#### Test 3.6: Abstract Formatting
**Type**: Visual Test  
**Steps**:
1. Verify abstract displays correctly

**Success Criteria**:
- Full abstract visible (no truncation)
- Line breaks preserved
- Whitespace normalized
- Readable typography

#### Test 3.7: Authors List Formatting
**Type**: Visual Test  
**Steps**:
1. Verify authors display

**Success Criteria**:
- All 6 authors listed
- Comma-separated or line-by-line
- No truncation
- Professional formatting

---

### 4. Reading Status & Tags (6 tests)

#### Test 4.1: Update Reading Status
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click reading status selector
2. Change from "To Read" → "Reading"
3. Verify update

**Success Criteria**:
- Status selector opens (dropdown or buttons)
- Can select different status
- Status updates in database
- Badge color changes (yellow for "Reading")
- Homepage list reflects change (if navigated back)

#### Test 4.2: Reading Status - All Options
**Type**: Interaction Test  
**Steps**:
1. Cycle through all statuses
2. "To Read" → "Reading" → "Completed" → "To Read"

**Success Criteria**:
- All 3 statuses work
- Badge colors update correctly
  - To Read: Blue
  - Reading: Yellow
  - Completed: Green
- Database updates for each change

#### Test 4.3: Add Tag
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click "Add tag" or type in tag input
2. Enter tag: "multiagent systems"
3. Press Enter or click Add

**Success Criteria**:
- Tag input accepts text
- Tag added to paper
- Tag displays in tags list
- Database updated
- Homepage shows tag on paper card

#### Test 4.4: Remove Tag
**Type**: Interaction Test  
**Steps**:
1. Click X or delete button on existing tag
2. Verify tag removed

**Success Criteria**:
- Tag removed from display
- Database updated
- Homepage reflects removal

#### Test 4.5: Multiple Tags
**Type**: Interaction Test  
**Steps**:
1. Add 5 tags to paper
2. Verify all display correctly

**Success Criteria**:
- All tags visible
- Tags wrapped if many
- Each tag has remove button
- Professional layout

#### Test 4.6: Tag Validation
**Type**: Validation Test  
**Steps**:
1. Try to add empty tag
2. Try to add duplicate tag
3. Try to add very long tag

**Success Criteria**:
- Empty tags rejected
- Duplicate tags prevented or handled
- Long tags truncated or wrapped
- User-friendly validation messages

---

### 5. Layout & Integration (9 tests)

#### Test 5.1: Page Layout Structure
**Type**: Visual Test  
**Steps**:
1. Navigate to paper detail page
2. Verify layout structure

**Success Criteria**:
- Header from PER-11 visible
- Two-column layout: PDF (left) + Notes/Metadata (right)
- Proper spacing and margins
- Professional appearance
- Goodreads-inspired aesthetic

#### Test 5.2: Layout Proportions
**Type**: Visual Test  
**Steps**:
1. Measure column widths

**Success Criteria**:
- PDF viewer: 60-70% width
- Notes/metadata sidebar: 30-40% width
- Balanced proportions
- No wasted space

#### Test 5.3: Navigation from Homepage
**Type**: Integration Test (Browser MCP)  
**Steps**:
1. Navigate to homepage
2. Click TinyTroupe paper card
3. Verify navigation to detail page

**Success Criteria**:
- URL changes to `/paper/j97dx96r97y92wk24aw4z3362n7shyrz`
- Detail page loads
- Correct paper displays
- No 404 error (PER-13 fixes this!)
- Smooth transition

#### Test 5.4: Back Navigation
**Type**: Navigation Test (Browser MCP)  
**Steps**:
1. From paper detail page
2. Click Goodpapers logo or browser back
3. Return to homepage

**Success Criteria**:
- Navigates back to homepage
- Paper still visible in list
- State preserved (search, filters)
- No data loss

#### Test 5.5: Direct URL Access
**Type**: Navigation Test  
**Steps**:
1. Navigate directly to `/paper/j97dx96r97y92wk24aw4z3362n7shyrz`
2. Verify page loads correctly

**Success Criteria**:
- Paper loads from URL
- PDF displays
- Notes load
- Metadata correct
- No authentication redirect (using mock user)

#### Test 5.6: Invalid Paper ID
**Type**: Error Test  
**Steps**:
1. Navigate to `/paper/invalid-id`
2. Observe error handling

**Success Criteria**:
- Error message displays
- "Paper not found" or similar
- Link back to homepage
- Doesn't crash app
- Professional error UI

#### Test 5.7: Responsive Design - Desktop
**Type**: Responsive Test (Browser MCP)  
**Steps**:
1. Resize to desktop width (1920px)
2. Verify layout

**Success Criteria**:
- Two-column layout maintained
- PDF visible and readable
- Notes editor accessible
- No horizontal scroll
- Proper spacing

#### Test 5.8: Responsive Design - Smaller Desktop
**Type**: Responsive Test  
**Steps**:
1. Resize to smaller desktop (1280px)
2. Verify layout adjusts

**Success Criteria**:
- Layout still functional
- PDF readable
- Notes accessible
- May stack vertically if needed
- No broken layout

#### Test 5.9: Real-Time Updates Across Tabs
**Type**: Integration Test  
**Steps**:
1. Open paper detail in Tab 1
2. Update status or add tag
3. Open same paper in Tab 2
4. Verify Tab 2 reflects changes

**Success Criteria**:
- Changes appear in Tab 2 without refresh
- Real-time Convex reactivity working
- Consistent state across tabs
- No conflicts or race conditions

---

## Test Execution Order

### Phase 1: Route & PDF Loading (15 min)
1. Navigate to paper detail (5.3)
2. PDF loads from storage (1.1)
3. PDF loading state (1.7)
4. Layout structure (5.1, 5.2)

### Phase 2: PDF Viewer Interactions (12 min)
5. Page navigation - next/previous (1.2)
6. Page navigation - direct input (1.3)
7. Zoom in (1.4)
8. Zoom out (1.5)
9. Fit to width (1.6)
10. PDF scrolling (1.9)

### Phase 3: Notes Functionality (10 min)
11. Notes editor rendering (2.1)
12. Create note - auto-save (2.2)
13. Update note - auto-save (2.3)
14. Debouncing behavior (2.4)
15. Notes persistence (2.5)

### Phase 4: Metadata & Controls (10 min)
16. Metadata display (3.1)
17. External ArXiv link (3.2)
18. Status badge (3.3)
19. Update reading status (4.1, 4.2)
20. Add/remove tags (4.3, 4.4, 4.5)

### Phase 5: Integration & Edge Cases (8 min)
21. Back navigation (5.4)
22. Direct URL access (5.5)
23. Invalid paper ID (5.6)
24. PDF error handling (1.8)
25. Notes error handling (2.8)
26. Real-time updates (5.9)

---

## Test Automation Script

```bash
#!/bin/bash
# test-per-13.sh

set -e

echo "🧪 PER-13 Testing Suite: Paper Detail Page with PDF Viewer & Notes"
echo "================================================================="

cd goodpapers

# Phase 1: File Structure
echo ""
echo "Phase 1: File Structure"
echo "----------------------"

echo "✓ Checking component files..."
test -f "app/paper/[paperId]/page.tsx" && echo "  ✓ Dynamic route exists"
test -f "components/papers/PDFViewer.tsx" && echo "  ✓ PDFViewer.tsx exists"
test -f "components/papers/NotesEditor.tsx" && echo "  ✓ NotesEditor.tsx exists"
test -f "components/papers/PaperMetadata.tsx" && echo "  ✓ PaperMetadata.tsx exists"
test -f "components/papers/PaperDetailView.tsx" && echo "  ✓ PaperDetailView.tsx exists"

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
grep -q "PDFViewer" "components/papers/PaperDetailView.tsx" && echo "  ✓ PDFViewer imported"
grep -q "NotesEditor" "components/papers/PaperDetailView.tsx" && echo "  ✓ NotesEditor imported"
grep -q "PaperMetadata" "components/papers/PaperDetailView.tsx" && echo "  ✓ PaperMetadata imported"
grep -q "useQuery" "components/papers/PaperDetailView.tsx" && echo "  ✓ Convex queries used"
grep -q "useMutation" "components/papers/NotesEditor.tsx" && echo "  ✓ Notes mutations used"

echo ""
echo "✅ Automated tests passed!"
echo ""
echo "🔍 Next: Manual testing in browser required"
echo "   1. Start dev server: npm run dev"
echo "   2. Navigate to: http://localhost:3000"
echo "   3. Click paper card to access detail page"
echo "   4. Test PDF viewer controls"
echo "   5. Test notes auto-save"
echo "   6. Test status/tags updates"
```

---

## Manual Test Checklist

### Setup
- [ ] Dev server running: `npm run dev`
- [ ] Open browser to http://localhost:3000
- [ ] TinyTroupe paper visible in homepage
- [ ] Browser console open (check for errors)

### PDF Viewer Testing (Browser MCP)

**Navigation to Detail Page**:
- [ ] Click TinyTroupe paper card from homepage
- [ ] URL changes to `/paper/j97dx96r97y92wk24aw4z3362n7shyrz`
- [ ] Page loads (no 404 - THIS IS NEW IN PER-13!)
- [ ] PDF starts loading

**PDF Loading**:
- [ ] Loading spinner displays
- [ ] PDF loads within 5 seconds
- [ ] First page of TinyTroupe PDF renders
- [ ] No CORS errors in console
- [ ] No 404 errors for PDF resource

**PDF Controls**:
- [ ] "Previous" button disabled on page 1
- [ ] Click "Next" → advances to page 2
- [ ] Page counter shows "Page 2 of {N}"
- [ ] Click "Previous" → returns to page 1
- [ ] Click "+" → PDF zooms in (110%, 120%...)
- [ ] Click "−" → PDF zooms out
- [ ] Zoom percentage displays correctly
- [ ] "Fit to Width" button scales PDF appropriately

**PDF Display Quality**:
- [ ] Text is readable
- [ ] Images render correctly
- [ ] No blurry rendering
- [ ] Annotations visible (if any in PDF)
- [ ] Scrolling is smooth

### Notes Editor Testing (Browser MCP)

**Notes Creation**:
- [ ] Notes textarea visible
- [ ] Placeholder text displays
- [ ] Can click and type in textarea
- [ ] Typing updates textarea content

**Auto-Save Functionality**:
- [ ] Type: "This paper introduces TinyTroupe..."
- [ ] Wait 1-2 seconds
- [ ] "Saving..." indicator appears
- [ ] "Saved at {time}" displays after save
- [ ] Check Convex dashboard → notes table → note created

**Notes Persistence**:
- [ ] Navigate back to homepage
- [ ] Click paper again to return
- [ ] Notes still present in editor
- [ ] Content unchanged
- [ ] No data loss

**Notes Update**:
- [ ] Modify existing note text
- [ ] Wait for auto-save
- [ ] "Saved at {time}" updates
- [ ] Refresh page → changes persisted

### Metadata & Controls Testing

**Metadata Display**:
- [ ] Paper title displays correctly
- [ ] All authors listed
- [ ] Abstract visible and readable
- [ ] ArXiv link present and clickable
- [ ] Publication date formatted nicely
- [ ] Status badge correct color

**Reading Status Update**:
- [ ] Click status selector/dropdown
- [ ] Change to "Reading"
- [ ] Badge changes to yellow
- [ ] Navigate to homepage → paper shows "Reading" badge
- [ ] Return to detail → status still "Reading"

**Tags Management**:
- [ ] Click "Add tag" or tag input
- [ ] Enter tag: "multiagent systems"
- [ ] Press Enter or click Add
- [ ] Tag appears in tags list
- [ ] Add second tag: "LLM"
- [ ] Both tags visible
- [ ] Click X on tag to remove
- [ ] Tag removed from display
- [ ] Navigate to homepage → tags reflected on paper card

### Navigation Testing

**Back to Homepage**:
- [ ] Click Goodpapers logo in header
- [ ] Returns to homepage
- [ ] Paper list still displays
- [ ] No data loss

**Direct URL Access**:
- [ ] Copy URL: `/paper/j97dx96r97y92wk24aw4z3362n7shyrz`
- [ ] Open in new tab
- [ ] Page loads correctly
- [ ] PDF and notes display

**Invalid Paper ID**:
- [ ] Navigate to `/paper/invalid-id-123`
- [ ] Error message displays
- [ ] "Paper not found" or similar
- [ ] Can navigate back to homepage
- [ ] No app crash

---

## Convex Dashboard Verification

**Setup**:
- [ ] Navigate to https://dashboard.convex.dev
- [ ] Select project: impartial-wolf-773
- [ ] Go to Data tab

**Paper Verification**:
- [ ] Check Data → papers table
- [ ] Find TinyTroupe paper (ID: j97dx96r97y92wk24aw4z3362n7shyrz)
- [ ] Verify pdfStorageId exists
- [ ] Note paper metadata

**Storage Verification**:
- [ ] Check Data → _storage table
- [ ] Find PDF file (match pdfStorageId)
- [ ] Verify file size (should be 1-10 MB)
- [ ] Note storage ID

**Notes Verification**:
- [ ] Check Data → notes table
- [ ] Find note for TinyTroupe paper
- [ ] Verify content matches what was typed
- [ ] Verify paperId and userId correct
- [ ] Check timestamps (createdAt, updatedAt)

---

## Test Scenarios with Expected Results

### Scenario 1: First-Time Paper View
**Steps**:
1. Click TinyTroupe paper from homepage
2. Detail page loads for first time
3. No existing notes

**Expected Result**:
```
1. Navigation to /paper/{paperId} ✓
2. PDF loads and displays ✓
3. Page shows: "Page 1 of 9" (or actual page count) ✓
4. Notes editor empty with placeholder ✓
5. Metadata displays: title, authors, abstract ✓
6. Status: "To Read" ✓
7. Tags: Empty ✓
8. Load time < 5 seconds ✓
```

### Scenario 2: Reading and Note-Taking Workflow
**Steps**:
1. Navigate to paper detail
2. Read PDF pages (navigate through pages)
3. Take notes while reading
4. Change status to "Reading"
5. Add tags: "multiagent systems", "LLM", "simulation"

**Expected Result**:
```
1. PDF navigation smooth ✓
2. Can advance through pages easily ✓
3. Notes auto-save as typing ✓
4. "Saving..." and "Saved at {time}" indicators ✓
5. Status changes to "Reading" with yellow badge ✓
6. Tags added and displayed ✓
7. Navigate away and back → all changes persisted ✓
```

### Scenario 3: Completing a Paper
**Steps**:
1. Finish reading paper
2. Add final notes
3. Change status to "Completed"
4. Return to homepage

**Expected Result**:
```
1. Final notes auto-save ✓
2. Status changes to "Completed" ✓
3. Badge turns green ✓
4. Homepage shows paper with "Completed" badge ✓
5. Filter by "Completed" → paper appears ✓
```

---

## Browser MCP Test Commands

### Test 1: Navigate to Detail Page
```typescript
browser.navigate("http://localhost:3000");
browser.click({ element: "TinyTroupe paper card", ref: "<ref>" });
browser.waitFor({ text: "TinyTroupe", time: 3 });
browser.snapshot();
// Verify: PDF viewer visible
// Verify: Notes editor visible
// Verify: Metadata displays
```

### Test 2: PDF Page Navigation
```typescript
browser.click({ element: "Next page button", ref: "<ref>" });
browser.snapshot();
// Verify: Page 2 displays
// Verify: Page counter updated

browser.click({ element: "Previous page button", ref: "<ref>" });
browser.snapshot();
// Verify: Back to page 1
```

### Test 3: Notes Auto-Save
```typescript
browser.type({
  element: "Notes textarea",
  ref: "<ref>",
  text: "This paper introduces TinyTroupe, an LLM-powered simulation toolkit."
});
browser.waitFor({ time: 2 }); // Wait for auto-save debounce
browser.snapshot();
// Verify: "Saved at {time}" displays
// Verify: Note in Convex dashboard
```

### Test 4: Update Reading Status
```typescript
browser.click({ element: "Status selector", ref: "<ref>" });
browser.click({ element: "Reading option", ref: "<ref>" });
browser.snapshot();
// Verify: Badge changes to yellow
// Verify: Text changes to "Reading"
```

### Test 5: Add Tags
```typescript
browser.type({
  element: "Tag input",
  ref: "<ref>",
  text: "multiagent systems",
  submit: true
});
browser.snapshot();
// Verify: Tag appears in tags list
```

---

## Performance Benchmarks

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| PDF load time | < 5s | Stopwatch from page load to PDF render |
| Page navigation | < 500ms | Time between click and page render |
| Zoom operation | < 200ms | Visual observation |
| Notes auto-save | 1s debounce | Console log timestamp |
| Status update | < 1s | Time to UI update |
| Tag add | < 500ms | Time to appear in list |

---

## Success Criteria Summary

### Automated Tests (8 tests)
- [ ] File structure tests pass
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Component imports validated
- [ ] PDF.js worker configured
- [ ] Dynamic route created
- [ ] Convex queries integrated
- [ ] Mutations integrated

### Manual Browser Tests (32 tests)
- [ ] PDF viewer works (10/10)
- [ ] Notes editor works (8/8)
- [ ] Metadata displays (7/7)
- [ ] Status/tags work (6/6)
- [ ] Layout/integration works (9/9)

---

## Expected Test Duration

- **Automated tests**: 5 minutes
- **Route navigation tests**: 5 minutes
- **PDF viewer tests**: 12 minutes
- **Notes editor tests**: 10 minutes
- **Metadata & controls tests**: 10 minutes
- **Integration tests**: 8 minutes
- **Total**: 50 minutes (includes buffer)

---

## Test Exit Criteria

**All tests must pass** before proceeding to PER-14:

✅ **PDF Viewer**:
- PDF loads and displays correctly
- Page navigation works
- Zoom controls functional
- Loading states work
- No CORS errors

✅ **Notes Editor**:
- Can type notes
- Auto-save working (1s debounce)
- Notes persist across navigation
- Saving indicators display
- No data loss

✅ **Metadata & Controls**:
- All metadata displays correctly
- Reading status updates work
- Tags add/remove work
- Changes reflect on homepage

✅ **Integration**:
- Navigation from homepage works (no 404!)
- Back navigation works
- Direct URL access works
- Real-time updates working
- Professional appearance

---

## Key Differences from PER-12

### Before PER-13 (Current State):
- ❌ Clicking paper → 404 error
- ❌ Cannot view PDFs
- ❌ Cannot take notes
- ❌ Cannot update status from detail view
- ❌ Cannot add tags from detail view

### After PER-13 (Expected):
- ✅ Clicking paper → Detail page loads
- ✅ Can view PDF in browser
- ✅ Can take notes with auto-save
- ✅ Can update reading status
- ✅ Can add/remove tags
- ✅ Full paper management experience

**This is a MAJOR usability improvement!**

---

## Next Steps After PER-13

Once PER-13 is complete and tested:

1. **PER-14**: Polish & Deploy
   - UI refinements
   - Additional loading states
   - Error handling improvements
   - Production deployment

2. **PER-15**: Final Testing & Launch
   - Cross-browser testing
   - Performance optimization
   - User acceptance testing

---

## Notes for Testing

- **Use TinyTroupe paper** (already in database from PER-12 testing)
- **PDF is real**: Actual 9-page academic paper from ArXiv
- **Mock auth working**: Test user already authenticated
- **Convex dashboard**: Keep open to verify database updates
- **Browser console**: Monitor for errors during testing

---

**Testing Focus**: Reading experience must be smooth and distraction-free! 📖

