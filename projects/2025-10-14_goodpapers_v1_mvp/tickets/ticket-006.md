# Ticket-006: PER-13 Testing & Validation

**Ticket**: PER-13 - Paper Detail Page with PDF Viewer & Notes Testing  
**Status**: Proposed (Awaiting Approval)  
**Created**: 2025-10-15  
**Estimated Time**: 45 minutes  
**Dependencies**: PER-8, PER-9, PER-10, PER-11, PER-12 complete

---

## Objective

Comprehensive testing and validation of PER-13 (Paper Detail Page with PDF Viewer & Notes) to ensure PDF viewing, notes editing with auto-save, metadata display, and reading status/tags management all work correctly and provide an excellent research workflow.

---

## Test Coverage Areas

### 1. PDF Viewer Functionality (10 tests)
### 2. Notes Editor & Auto-Save (8 tests)
### 3. Paper Metadata Display (6 tests)
### 4. Reading Status & Tags (7 tests)
### 5. Layout & Integration (6 tests)
### 6. Performance & Edge Cases (5 tests)

**Total: 42 automated + manual tests**

---

## Detailed Test Plan

### 1. PDF Viewer Functionality (10 tests)

#### Test 1.1: PDF Loads and Displays
**Type**: Visual Test (Browser MCP)  
**Steps**:
1. Navigate to paper detail page
2. Verify PDF loads and first page displays

**Success Criteria**:
- PDF renders on left side of page
- First page visible
- PDF is readable and clear
- No rendering errors

#### Test 1.2: Page Navigation - Next/Previous
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click "Next" button
2. Verify page 2 displays
3. Click "Previous" button
4. Verify page 1 displays

**Success Criteria**:
- Next button advances to next page
- Previous button goes to previous page
- Page number updates correctly
- Buttons disabled appropriately (first/last page)

#### Test 1.3: Page Number Display
**Type**: Visual Test  
**Steps**:
1. Check page counter display

**Success Criteria**:
- Shows "Page X of Y"
- Updates when navigating pages
- Accurate total page count

#### Test 1.4: Zoom In
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click zoom in button (+)
2. Verify PDF enlarges

**Success Criteria**:
- PDF scales up
- Text becomes larger and more readable
- No pixelation or quality loss
- Can zoom to 200%

#### Test 1.5: Zoom Out
**Type**: Interaction Test  
**Steps**:
1. Click zoom out button (−)
2. Verify PDF shrinks

**Success Criteria**:
- PDF scales down
- Can zoom to 50%
- Entire page visible at small zoom
- Zoom level displays correctly

#### Test 1.6: Zoom Level Display
**Type**: Visual Test  
**Steps**:
1. Check zoom percentage display

**Success Criteria**:
- Shows current zoom (e.g., "100%")
- Updates when zooming
- Accurate percentage

#### Test 1.7: PDF Loading State
**Type**: UX Test  
**Steps**:
1. Navigate to paper detail page
2. Observe loading state before PDF renders

**Success Criteria**:
- Loading spinner displays
- Spinner centers in PDF viewer area
- Smooth transition to PDF when loaded
- No flash of unstyled content

#### Test 1.8: PDF with Many Pages
**Type**: Performance Test  
**Steps**:
1. Load paper with 20+ pages
2. Navigate through pages

**Success Criteria**:
- PDF loads successfully
- Page navigation smooth
- No memory issues
- Performance acceptable

#### Test 1.9: PDF Error Handling
**Type**: Error Test  
**Steps**:
1. Navigate to paper with missing/corrupted PDF
2. Verify error state

**Success Criteria**:
- Error message displays
- Message is helpful: "Failed to load PDF"
- Offers retry or alternative (link to ArXiv)
- Doesn't crash application

#### Test 1.10: PDF CORS and Worker
**Type**: Integration Test  
**Steps**:
1. Verify PDF.js worker loads correctly
2. Check browser console for CORS errors

**Success Criteria**:
- PDF.js worker loads from CDN
- No CORS errors in console
- PDF text layer renders (selectable text)
- PDF annotations render (links, highlights)

---

### 2. Notes Editor & Auto-Save (8 tests)

#### Test 2.1: Notes Editor Renders
**Type**: Visual Test (Browser MCP)  
**Steps**:
1. Navigate to paper detail page
2. Locate notes editor

**Success Criteria**:
- Notes editor visible on right side
- Text area is large and comfortable
- Placeholder text: "Take notes on this paper..."
- Professional styling

#### Test 2.2: Load Existing Notes
**Type**: Data Test  
**Steps**:
1. Add note to paper in Convex dashboard
2. Navigate to paper detail page
3. Verify note loads

**Success Criteria**:
- Existing note content displays in editor
- Note loads without delay
- Full content visible (not truncated)

#### Test 2.3: Create New Note
**Type**: Integration Test (Browser MCP)  
**Steps**:
1. Navigate to paper with no notes
2. Type in notes editor
3. Wait for auto-save

**Success Criteria**:
- Can type in editor immediately
- "Saving..." indicator appears
- "Saved at {time}" appears after save
- Note persists in database

#### Test 2.4: Update Existing Note
**Type**: Integration Test  
**Steps**:
1. Load paper with existing note
2. Modify note content
3. Wait for auto-save

**Success Criteria**:
- Can edit existing note
- Auto-save triggers after typing stops
- Updated content persists
- Timestamp updates

#### Test 2.5: Auto-Save Debouncing
**Type**: Performance Test  
**Steps**:
1. Type rapidly in notes editor
2. Observe save behavior

**Success Criteria**:
- Doesn't save on every keystroke
- Waits ~1 second after typing stops
- "Saving..." appears during save
- Only one save request per typing burst

#### Test 2.6: Auto-Save Error Handling
**Type**: Error Test  
**Steps**:
1. Simulate network failure
2. Type in notes
3. Observe error behavior

**Success Criteria**:
- Error message if save fails
- Notes remain in editor (not lost)
- Can retry save
- Indicates unsaved changes

#### Test 2.7: Large Notes (>10KB)
**Type**: Performance Test  
**Steps**:
1. Type or paste large amount of text
2. Verify auto-save works

**Success Criteria**:
- Handles large notes
- Auto-save still works
- No performance degradation
- Text area scrollable

#### Test 2.8: Notes Persistence Across Navigation
**Type**: Integration Test  
**Steps**:
1. Take notes on paper
2. Wait for auto-save
3. Navigate to homepage
4. Return to paper detail

**Success Criteria**:
- Notes still visible after navigation
- No data loss
- Loads quickly

---

### 3. Paper Metadata Display (6 tests)

#### Test 3.1: Title and Authors Display
**Type**: Visual Test  
**Steps**:
1. Navigate to paper detail page
2. Verify title and authors display

**Success Criteria**:
- Title displays prominently
- Authors display as comma-separated list
- Proper typography and spacing

#### Test 3.2: Abstract Display
**Type**: Visual Test  
**Steps**:
1. Verify abstract displays correctly

**Success Criteria**:
- Full abstract visible (not truncated)
- Readable line-height and spacing
- Proper formatting

#### Test 3.3: Reading Status Selector
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Locate reading status dropdown
2. Change status from "To Read" to "Reading"
3. Verify update

**Success Criteria**:
- Dropdown shows current status
- Can change to any status
- Update saves immediately
- Status persists after refresh

#### Test 3.4: Tags Display and Management
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Add tag "machine-learning"
2. Add tag "transformers"
3. Remove first tag

**Success Criteria**:
- Tags display as pills
- Can add new tags
- Can remove tags
- Tags persist in database

#### Test 3.5: External ArXiv Link
**Type**: Integration Test  
**Steps**:
1. Click "View on ArXiv" link

**Success Criteria**:
- Opens ArXiv page in new tab
- Correct paper on ArXiv
- Link has proper styling

#### Test 3.6: Timestamps Display
**Type**: Visual Test  
**Steps**:
1. Verify created/updated timestamps

**Success Criteria**:
- Shows when paper was added
- Shows when last updated
- Dates formatted correctly

---

### 4. Reading Status & Tags (7 tests)

#### Test 4.1: Update Status to "To Read"
**Type**: Mutation Test (Browser MCP)  
**Steps**:
1. Change status to "To Read"
2. Check Convex dashboard

**Success Criteria**:
- Status updates in database
- Badge color changes (blue)
- Homepage reflects change

#### Test 4.2: Update Status to "Reading"
**Type**: Mutation Test  
**Steps**:
1. Change status to "Reading"

**Success Criteria**:
- Status updates
- Badge color changes (yellow)
- Homepage reflects change

#### Test 4.3: Update Status to "Completed"
**Type**: Mutation Test  
**Steps**:
1. Change status to "Completed"

**Success Criteria**:
- Status updates
- Badge color changes (green)
- Homepage reflects change

#### Test 4.4: Add Single Tag
**Type**: Mutation Test (Browser MCP)  
**Steps**:
1. Enter tag name in input
2. Click "Add" or press Enter

**Success Criteria**:
- Tag appears as pill
- Tag persists in database
- Input clears after adding

#### Test 4.5: Add Multiple Tags
**Type**: Mutation Test  
**Steps**:
1. Add 5 different tags

**Success Criteria**:
- All tags display correctly
- No duplicate tags allowed
- Tags wrap on multiple lines if needed

#### Test 4.6: Remove Tag
**Type**: Mutation Test (Browser MCP)  
**Steps**:
1. Click X on tag pill

**Success Criteria**:
- Tag disappears from display
- Tag removed from database
- Other tags unaffected

#### Test 4.7: Tag Input Validation
**Type**: Validation Test  
**Steps**:
1. Try to add empty tag
2. Try to add whitespace-only tag

**Success Criteria**:
- Empty tags rejected
- Whitespace trimmed
- "Add" button disabled for invalid input

---

### 5. Layout & Integration (6 tests)

#### Test 5.1: Two-Column Layout
**Type**: Visual Test (Browser MCP)  
**Steps**:
1. Navigate to paper detail page
2. Verify layout structure

**Success Criteria**:
- PDF on left (60-70% width)
- Sidebar on right (30-40% width)
- Proper spacing between columns
- Height fills viewport

#### Test 5.2: Sidebar Scrolling
**Type**: UX Test  
**Steps**:
1. View paper with long abstract and many tags
2. Scroll sidebar

**Success Criteria**:
- Sidebar scrolls independently
- PDF stays fixed during scroll
- Scrollbar visible when content overflows

#### Test 5.3: Navigation Header Integration
**Type**: Integration Test  
**Steps**:
1. Verify header displays correctly
2. Click logo to return to homepage

**Success Criteria**:
- Header shows logo and user menu (from PER-11)
- Logo link navigates to homepage
- User menu still functional
- Breadcrumb or back button (optional)

#### Test 5.4: Responsive Design - Desktop
**Type**: Responsive Test (Browser MCP)  
**Steps**:
1. View at desktop width (1920px)

**Success Criteria**:
- Two-column layout visible
- Proper proportions (2:1 ratio)
- Professional appearance

#### Test 5.5: Responsive Design - Tablet
**Type**: Responsive Test  
**Steps**:
1. View at tablet width (768px)

**Success Criteria**:
- Layout adjusts appropriately
- Stacks vertically or maintains columns
- All features accessible

#### Test 5.6: Responsive Design - Mobile
**Type**: Responsive Test  
**Steps**:
1. View at mobile width (375px)

**Success Criteria**:
- Layout stacks vertically
- PDF viewer usable on mobile
- Notes editor accessible
- All controls functional

---

### 6. Performance & Edge Cases (5 tests)

#### Test 6.1: PDF Load Performance
**Type**: Performance Test  
**Steps**:
1. Navigate to paper detail
2. Time until PDF fully rendered

**Success Criteria**:
- PDF loads < 5 seconds (spec requirement)
- Loading indicator visible during load
- Smooth transition when loaded

#### Test 6.2: PDF with Large File Size (>10MB)
**Type**: Edge Case Test  
**Steps**:
1. Add paper with large PDF
2. Test loading and navigation

**Success Criteria**:
- PDF loads successfully (may take longer)
- Progress indicator shows loading
- Can still navigate pages
- No memory issues

#### Test 6.3: PDF with Single Page
**Type**: Edge Case Test  
**Steps**:
1. Load paper with only 1 page
2. Test navigation buttons

**Success Criteria**:
- Next/Previous buttons disabled
- Page count shows "1 of 1"
- PDF displays correctly

#### Test 6.4: Concurrent Note Editing (Multi-Tab)
**Type**: Edge Case Test  
**Steps**:
1. Open same paper in two browser tabs
2. Edit notes in Tab 1
3. Observe Tab 2

**Success Criteria**:
- Changes in Tab 1 appear in Tab 2 (real-time)
- No conflicting saves
- Last write wins (or proper merge)

#### Test 6.5: Network Failure During Auto-Save
**Type**: Error Test  
**Steps**:
1. Block network in DevTools
2. Type in notes editor
3. Unblock network

**Success Criteria**:
- Error message shows save failed
- Notes not lost in editor
- Retries when network restored
- User can manually trigger save

---

## Test Execution Order

### Phase 1: Component Rendering (8 min)
1. Paper detail page loads (5.1)
2. PDF viewer renders (1.1)
3. Notes editor renders (2.1)
4. Metadata displays (3.1, 3.2)

### Phase 2: PDF Viewer Functionality (12 min)
5. Page navigation (1.2, 1.3)
6. Zoom controls (1.4, 1.5, 1.6)
7. Loading state (1.7)
8. Error handling (1.9)
9. CORS/Worker (1.10)
10. Large PDFs (1.8)

### Phase 3: Notes Functionality (10 min)
11. Load existing notes (2.2)
12. Create new note (2.3)
13. Update note (2.4)
14. Auto-save debouncing (2.5)
15. Auto-save errors (2.6)
16. Large notes (2.7)
17. Notes persistence (2.8)

### Phase 4: Metadata & Status (10 min)
18. Reading status selector (3.3, 4.1-4.3)
19. Tags management (3.4, 4.4-4.7)
20. External link (3.5)
21. Timestamps (3.6)

### Phase 5: Performance & Edge Cases (10 min)
22. PDF load performance (6.1)
23. Large PDF handling (6.2)
24. Single page PDF (6.3)
25. Concurrent editing (6.4)
26. Network failure (6.5)

---

## Test Automation Script

```bash
#!/bin/bash
# test-per-13.sh

set -e

echo "🧪 PER-13 Testing Suite: Paper Detail with PDF & Notes"
echo "====================================================="

cd goodpapers

# Phase 1: File Structure
echo ""
echo "Phase 1: File Structure"
echo "----------------------"

echo "✓ Checking component files..."
test -f "app/paper/[paperId]/page.tsx" && echo "  ✓ Paper detail route exists"
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
grep -q "react-pdf" "components/papers/PDFViewer.tsx" && echo "  ✓ react-pdf imported"
grep -q "useMutation" "components/papers/NotesEditor.tsx" && echo "  ✓ Auto-save mutation used"
grep -q "useQuery" "components/papers/PaperDetailView.tsx" && echo "  ✓ Paper query used"

echo ""
echo "✅ Automated tests passed!"
echo ""
echo "🔍 Next: Manual testing in browser required"
echo "   1. Start dev server: npm run dev"
echo "   2. Navigate to paper detail page"
echo "   3. Test PDF viewing (zoom, navigation)"
echo "   4. Test notes editor (auto-save)"
echo "   5. Test metadata editing (status, tags)"
```

---

## Manual Test Checklist

### Paper Detail Page Testing (Browser MCP)

**Setup**:
- [ ] Start dev server: `npm run dev`
- [ ] Add at least one paper via homepage
- [ ] Navigate to paper detail page from homepage
- [ ] Open browser console (check for errors)

**PDF Viewer**:
- [ ] PDF loads and displays correctly
- [ ] First page visible on load
- [ ] Click "Next" → page 2 displays
- [ ] Click "Previous" → page 1 displays
- [ ] Page counter shows "Page 1 of X"
- [ ] Click zoom in (+) → PDF enlarges
- [ ] Click zoom out (−) → PDF shrinks
- [ ] Zoom percentage displays correctly
- [ ] PDF text is selectable
- [ ] No CORS errors in console

**Notes Editor**:
- [ ] Notes editor visible on right side
- [ ] Can type in editor immediately
- [ ] Type "Test note" and wait
- [ ] "Saving..." indicator appears
- [ ] "Saved at {time}" appears
- [ ] Refresh page → note persists
- [ ] Edit note → auto-saves again
- [ ] No lag or delays while typing

**Paper Metadata**:
- [ ] Title displays prominently
- [ ] Authors list visible
- [ ] Abstract displays fully
- [ ] Reading status dropdown shows current status
- [ ] Can change reading status
- [ ] Status persists after save
- [ ] ArXiv link is clickable
- [ ] Timestamps display correctly

**Tags Management**:
- [ ] Tag input field visible
- [ ] Enter tag name "machine-learning"
- [ ] Click "Add" or press Enter
- [ ] Tag appears as pill
- [ ] Click X on tag → tag removed
- [ ] Add multiple tags → all display
- [ ] Tags persist after refresh

**Navigation & Integration**:
- [ ] Header displays with logo and user menu
- [ ] Logo link returns to homepage
- [ ] User menu still functional
- [ ] Can navigate back to homepage
- [ ] Can navigate to another paper

**Responsive Design**:
- [ ] Resize to desktop (1920px) → two-column layout
- [ ] Resize to tablet (768px) → layout adjusts
- [ ] Resize to mobile (375px) → stacks vertically
- [ ] All features accessible at all sizes

---

## Test Scenarios with Expected Results

### Scenario 1: First-Time Paper View
**Steps**:
1. Click paper from homepage
2. Paper detail page loads
3. PDF renders
4. Take first notes

**Expected Result**:
```
1. Navigate to /paper/{paperId} ✓
2. PDF loads on left side ✓
3. Metadata displays on right ✓
4. Type in notes editor ✓
5. Auto-save triggers ✓
6. "Saved at {time}" displays ✓
7. Notes persist in database ✓
```

**Database State**:
```json
// notes table should have new entry:
{
  "paperId": "<paper_id>",
  "userId": "<user_id>",
  "content": "Test note",
  "createdAt": 1697414400000,
  "updatedAt": 1697414400000
}
```

### Scenario 2: Research Workflow
**Steps**:
1. Open paper detail
2. Read PDF (navigate pages, zoom in)
3. Take notes while reading
4. Mark as "Reading"
5. Add tags
6. Return to homepage

**Expected Result**:
```
1. PDF loads ✓
2. Can navigate pages smoothly ✓
3. Zoom works for detailed reading ✓
4. Notes auto-save as typing ✓
5. Status updates to "Reading" ✓
6. Tags added: "nlp", "transformers" ✓
7. Homepage shows updated status ✓
```

### Scenario 3: Returning to Paper
**Steps**:
1. View paper, take notes
2. Navigate to homepage
3. Return to same paper
4. Continue note-taking

**Expected Result**:
```
1. Previous notes display immediately ✓
2. PDF remembers last page (optional) ✓
3. Can continue editing notes ✓
4. Auto-save still works ✓
5. No data loss ✓
```

---

## Browser MCP Test Commands

### Test 1: PDF Viewer
```typescript
// Navigate to paper detail
browser.navigate("http://localhost:3000/paper/<paperId>");

// Wait for PDF to load
browser.waitFor({ time: 5 });

// Take screenshot
browser.screenshot("pdf-viewer.png");

// Test navigation
browser.click({ element: "Next page button", ref: "<ref>" });
browser.snapshot();
```

### Test 2: Notes Editor
```typescript
// Type in notes
browser.type({
  element: "Notes textarea",
  ref: "<ref>",
  text: "This is a test note about the paper",
  slowly: false
});

// Wait for auto-save
browser.waitFor({ time: 2 });

// Verify save indicator
browser.snapshot();
// Should show "Saved at {time}"
```

### Test 3: Tags Management
```typescript
// Add tag
browser.type({
  element: "Tag input",
  ref: "<ref>",
  text: "machine-learning",
  submit: false
});
browser.click({ element: "Add tag button", ref: "<ref>" });

// Verify tag appears
browser.snapshot();
```

### Test 4: Status Change
```typescript
// Change reading status
browser.selectOption({
  element: "Reading status dropdown",
  ref: "<ref>",
  values: ["reading"]
});

// Verify update
browser.snapshot();
```

---

## Success Criteria Summary

### Automated Tests (8 tests)
- [ ] File structure tests pass
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Component validation passes

### Manual Browser Tests (34 tests)
- [ ] PDF viewer works (10/10)
- [ ] Notes editor works (8/8)
- [ ] Metadata displays correctly (6/6)
- [ ] Status/tags work (7/7)
- [ ] Layout/integration works (6/6)
- [ ] Performance acceptable (5/5)

---

## Expected Test Duration

- **Automated tests**: 5 minutes
- **PDF viewer tests**: 8 minutes
- **Notes editor tests**: 7 minutes
- **Metadata tests**: 5 minutes
- **Status/tags tests**: 5 minutes
- **Layout/performance tests**: 8 minutes
- **Total**: 38 minutes (~45 min with buffer)

---

## Performance Benchmarks

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| PDF load time | < 5s | Stopwatch from navigation to render |
| Page navigation | < 500ms | Visual observation |
| Auto-save delay | 1s | Time from last keystroke to save |
| Status update | < 1s | Time from select to database update |
| Tag add/remove | < 1s | Time from action to UI update |

---

## Test Exit Criteria

**All tests must pass** before proceeding to PER-14:

✅ **PDF Viewer**:
- PDF loads and displays correctly
- Navigation and zoom work smoothly
- Loading states professional
- Error handling graceful

✅ **Notes Editor**:
- Auto-save works reliably
- No data loss
- Performance good
- Real-time updates function

✅ **Metadata Management**:
- All metadata displays correctly
- Status updates work
- Tags management functional
- Links work

✅ **Integration**:
- Layout is professional
- Navigation works
- Responsive design adequate
- Performance meets targets

---

## Next Steps After PER-13

Once PER-13 is complete and tested:

1. **PER-14**: Polish, Observability & Deployment
   - UI refinements and animations
   - Error boundary improvements
   - Observability setup (Vercel Analytics, Convex logs)
   - Production deployment configuration
   - Performance optimization

2. **PER-15**: Final Testing & Launch Validation
   - End-to-end smoke tests
   - Cross-browser testing
   - Performance validation
   - Launch readiness checklist

---

**Testing Focus**: PDF viewing and note-taking must be seamless for research workflow! 📄📝

