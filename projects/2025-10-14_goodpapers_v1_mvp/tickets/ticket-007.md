# Ticket-007: PER-14 Testing & Production Validation

**Ticket**: PER-14 - Polish, Observability & Deployment Testing  
**Status**: Proposed (Awaiting Execution)  
**Created**: 2025-10-15  
**Estimated Time**: 60 minutes  
**Dependencies**: PER-8, PER-9, PER-10, PER-11, PER-12, PER-13 complete

---

## Objective

Comprehensive testing and validation of PER-14 (PDF Viewer Fix, UI Polish, Error Handling, Observability, and Production Deployment) to ensure the Goodpapers MVP is production-ready with the critical PDF viewer issue resolved, polished UI, comprehensive error handling, and proper monitoring.

---

## Test Coverage Areas

### 1. PDF Viewer CSP Fix (CRITICAL - 10 tests)
### 2. UI Polish & Aesthetics (8 tests)
### 3. Error Handling & Toasts (7 tests)
### 4. Empty States (5 tests)
### 5. Observability (6 tests)
### 6. Pre-commit Hooks (4 tests)
### 7. Production Deployment (12 tests)
### 8. Performance & Core Web Vitals (8 tests)

**Total: 60 tests (automated + manual + production)**

---

## Context from PER-13

### Current Blocking Issue

**PDF Viewer Blocked by CSP** (from PER-13 testing):
- ❌ PDF.js worker cannot load due to Content Security Policy
- Console errors: "Refused to create a worker from 'blob:...'"
- All PDF viewer code is correct - only CSP configuration needed
- This is the **PRIMARY** issue to fix in PER-14

### Working Features (from PER-13)

✅ All other features working:
- Paper detail page navigation
- Notes editor with auto-save
- Reading status updates
- Tags management
- Metadata display
- Back navigation

### What PER-14 Adds

- ✅ PDF viewer working (CSP fix)
- ✅ Polished UI (Goodreads aesthetic)
- ✅ Toast notifications for errors
- ✅ Empty states throughout
- ✅ Convex logging
- ✅ Vercel Analytics
- ✅ Pre-commit hooks
- ✅ Production deployment

---

## Detailed Test Plan

### 1. PDF Viewer CSP Fix (CRITICAL - 10 tests)

#### Test 1.1: PDF Loads Successfully
**Type**: Integration Test (Browser MCP - CRITICAL)  
**Steps**:
1. Start dev server with updated `next.config.ts`
2. Navigate to paper detail page
3. Observe PDF loading

**Success Criteria**:
- ✅ PDF loads without CSP errors
- ✅ No console errors for "Refused to create a worker"
- ✅ No console errors for "Refused to load the script"
- ✅ First page of PDF displays within 5 seconds
- ✅ Loading spinner shows during load

**Expected Console** (before fix):
```
❌ Refused to create a worker from 'blob:http://localhost:3000/...'
❌ Refused to load the script 'https://cdnjs.cloudflare.com/...'
```

**Expected Console** (after fix):
```
✅ No CSP errors
✅ Clean console (maybe some Next.js dev logs only)
```

#### Test 1.2: PDF Page Navigation
**Type**: Interaction Test  
**Steps**:
1. Load PDF on paper detail page
2. Click "Next" button
3. Click "Previous" button
4. Enter page number directly

**Success Criteria**:
- ✅ Can navigate to next page
- ✅ Can navigate to previous page
- ✅ Page counter updates correctly
- ✅ Can jump to specific page via input
- ✅ No lag or errors during navigation

#### Test 1.3: PDF Zoom Controls
**Type**: Interaction Test  
**Steps**:
1. Load PDF
2. Click zoom in (+)
3. Click zoom out (−)
4. Click "Fit to Width"

**Success Criteria**:
- ✅ Zoom in increases PDF size
- ✅ Zoom out decreases PDF size
- ✅ Fit to width scales appropriately
- ✅ Zoom percentage displays correctly
- ✅ PDF quality maintained at all zoom levels

#### Test 1.4: PDF Worker Configuration
**Type**: Technical Validation  
**Steps**:
1. Check `next.config.ts` CSP headers
2. Verify worker-src includes `blob:`
3. Verify script-src includes CDN
4. Check browser DevTools → Network tab

**Success Criteria**:
- ✅ CSP headers present in response
- ✅ `worker-src 'self' blob:` configured
- ✅ `script-src` allows CDN (cdnjs.cloudflare.com)
- ✅ Worker file loads successfully (200 status)
- ✅ No CSP violation reports

#### Test 1.5: Multiple PDFs
**Type**: Regression Test  
**Steps**:
1. Navigate to Paper 1 detail page
2. Load PDF successfully
3. Navigate back to homepage
4. Navigate to Paper 2 detail page
5. Load different PDF

**Success Criteria**:
- ✅ First PDF loads
- ✅ Can navigate away cleanly
- ✅ Second PDF loads without errors
- ✅ No memory leaks
- ✅ Both PDFs work independently

#### Test 1.6: PDF Rendering Quality
**Type**: Visual Test  
**Steps**:
1. Load academic paper PDF
2. Zoom to 100%, 150%, 200%
3. Check text readability
4. Check image/figure clarity

**Success Criteria**:
- ✅ Text is crisp and readable
- ✅ Images render clearly
- ✅ Figures and equations display correctly
- ✅ No pixelation at higher zoom
- ✅ Colors accurate

#### Test 1.7: PDF Error Handling
**Type**: Error Test  
**Steps**:
1. Navigate to paper with missing PDF (simulate)
2. Navigate to paper with corrupted PDF (if possible)
3. Observe error display

**Success Criteria**:
- ✅ Error message displays clearly
- ✅ Error is user-friendly
- ✅ Provides retry/refresh option
- ✅ Doesn't crash app
- ✅ Can navigate away from error state

#### Test 1.8: PDF in Different Browsers
**Type**: Cross-Browser Test  
**Browsers**: Chrome, Firefox, Safari (if available)

**Success Criteria**:
- ✅ PDF loads in Chrome
- ✅ PDF loads in Firefox
- ✅ PDF loads in Safari (if tested)
- ✅ Controls work in all browsers
- ✅ No browser-specific CSP issues

#### Test 1.9: PDF Performance
**Type**: Performance Test  
**Steps**:
1. Load small PDF (< 5MB)
2. Load medium PDF (5-10 MB)
3. Load large PDF (> 10 MB)
4. Measure load times

**Success Criteria**:
- ✅ Small PDF: < 2 seconds
- ✅ Medium PDF: < 5 seconds
- ✅ Large PDF: < 10 seconds
- ✅ Loading indicator visible
- ✅ No UI freezing

#### Test 1.10: PDF CSP Headers Verification
**Type**: Technical Validation  
**Steps**:
1. Open browser DevTools
2. Navigate to paper detail page
3. Check Response Headers

**Expected Headers**:
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com; 
  worker-src 'self' blob:; 
  ...
```

**Success Criteria**:
- ✅ CSP header present
- ✅ `worker-src 'self' blob:` included
- ✅ `script-src` allows unsafe-eval (for PDF.js)
- ✅ `script-src` allows CDN
- ✅ All directives properly formatted

---

### 2. UI Polish & Aesthetics (8 tests)

#### Test 2.1: Color Scheme Consistency
**Type**: Visual Test  
**Steps**:
1. Navigate through all pages
2. Check primary colors
3. Check status badge colors
4. Check button colors

**Success Criteria**:
- ✅ Consistent primary color (#00635d teal)
- ✅ Accent color used for CTAs
- ✅ Status colors consistent (blue/yellow/green)
- ✅ Text colors readable (good contrast)
- ✅ Goodreads-inspired aesthetic

#### Test 2.2: Typography Hierarchy
**Type**: Visual Test  
**Steps**:
1. Check h1, h2, h3 sizing
2. Check body text readability
3. Check font weights
4. Verify font loading

**Success Criteria**:
- ✅ Clear heading hierarchy
- ✅ Body text readable (16px minimum)
- ✅ Proper font weights (bold for headers)
- ✅ Inter font loads correctly
- ✅ No font flash (FOUT)

#### Test 2.3: Spacing & Layout
**Type**: Visual Test  
**Steps**:
1. Check padding/margins on cards
2. Check grid gaps
3. Check component spacing
4. Verify responsive design

**Success Criteria**:
- ✅ Consistent spacing (4px/8px/16px/24px)
- ✅ Proper card padding
- ✅ Grid gaps consistent
- ✅ No elements too close together
- ✅ Responsive breakpoints work

#### Test 2.4: Hover States
**Type**: Interaction Test  
**Steps**:
1. Hover over paper cards
2. Hover over buttons
3. Hover over links
4. Check transitions

**Success Criteria**:
- ✅ Cards lift on hover (shadow increase)
- ✅ Buttons change color smoothly
- ✅ Links show clear hover state
- ✅ Transitions smooth (150-200ms)
- ✅ Cursor changes to pointer appropriately

#### Test 2.5: Loading Skeletons
**Type**: UX Test  
**Steps**:
1. Navigate to homepage (observe skeleton)
2. Navigate to paper detail (observe loading)
3. Add paper (observe progress)

**Success Criteria**:
- ✅ Skeleton loaders display immediately
- ✅ Shimmer animation smooth
- ✅ Layout doesn't shift when content loads
- ✅ Loading states everywhere async
- ✅ Professional appearance

#### Test 2.6: Transitions & Animations
**Type**: Animation Test  
**Steps**:
1. Navigate between pages
2. Open/close modal
3. Show/hide elements
4. Observe all animations

**Success Criteria**:
- ✅ Page transitions smooth
- ✅ Modal fades in/out
- ✅ No janky animations
- ✅ 60fps performance
- ✅ Animations enhance UX (not distract)

#### Test 2.7: Empty States Design
**Type**: Visual Test  
**Steps**:
1. View empty paper list
2. View empty notes
3. View empty search results

**Success Criteria**:
- ✅ Empty states have icons
- ✅ Clear messaging
- ✅ Call-to-action buttons present
- ✅ Professional appearance
- ✅ Helpful guidance

#### Test 2.8: Overall Aesthetic
**Type**: Subjective Visual Test  
**Steps**:
1. Compare to Goodreads.com
2. Check overall polish
3. Verify professional appearance

**Success Criteria**:
- ✅ Feels like Goodreads for papers
- ✅ Professional, polished appearance
- ✅ Consistent design language
- ✅ No rough edges
- ✅ Ready for production

---

### 3. Error Handling & Toasts (7 tests)

#### Test 3.1: Toast Notification Display
**Type**: UI Test  
**Steps**:
1. Trigger success toast (add paper)
2. Trigger error toast (invalid ArXiv ID)
3. Trigger info toast (if applicable)

**Success Criteria**:
- ✅ Toast appears in bottom-right
- ✅ Correct styling for type (success/error/info)
- ✅ Auto-dismisses after 3 seconds
- ✅ Can manually close with X
- ✅ Readable text

#### Test 3.2: Add Paper Error Handling
**Type**: Error Test  
**Steps**:
1. Enter invalid ArXiv URL
2. Enter non-existent ArXiv ID
3. Simulate network failure
4. Check error display

**Success Criteria**:
- ✅ Error toast shows
- ✅ Error message in modal
- ✅ User-friendly message (not technical)
- ✅ Can retry
- ✅ Form doesn't reset on error

#### Test 3.3: Notes Save Error Handling
**Type**: Error Test  
**Steps**:
1. Type notes
2. Simulate save failure
3. Observe error feedback

**Success Criteria**:
- ✅ Error message displays
- ✅ Notes not lost
- ✅ Retry mechanism
- ✅ Clear feedback to user
- ✅ Auto-retry (optional)

#### Test 3.4: Network Error Handling
**Type**: Error Test  
**Steps**:
1. Disconnect network
2. Try to load homepage
3. Try to add paper
4. Try to save notes

**Success Criteria**:
- ✅ Network error messages clear
- ✅ Suggests checking connection
- ✅ Retry option available
- ✅ Graceful degradation
- ✅ No app crash

#### Test 3.5: Auth Error Handling
**Type**: Error Test  
**Steps**:
1. Sign out
2. Try to access protected route
3. Expire session (simulate)
4. Check redirect behavior

**Success Criteria**:
- ✅ Redirects to sign-in
- ✅ Clear message about auth requirement
- ✅ After sign-in, redirects back
- ✅ Session refresh handled
- ✅ No data loss

#### Test 3.6: Toast Queue
**Type**: Edge Case Test  
**Steps**:
1. Trigger multiple toasts rapidly
2. Observe behavior

**Success Criteria**:
- ✅ Toasts queue or replace (not stack)
- ✅ Latest toast visible
- ✅ No UI overlap issues
- ✅ All dismissible
- ✅ Performance remains good

#### Test 3.7: Error Logging
**Type**: Technical Validation  
**Steps**:
1. Trigger various errors
2. Check Convex dashboard logs
3. Verify error details captured

**Success Criteria**:
- ✅ Errors logged to Convex
- ✅ Error details captured (message, stack)
- ✅ Context included (userId, paperId, etc.)
- ✅ Timestamp correct
- ✅ Searchable in dashboard

---

### 4. Empty States (5 tests)

#### Test 4.1: Empty Paper List
**Type**: UX Test  
**Steps**:
1. New user with no papers
2. View homepage

**Success Criteria**:
- ✅ Empty state displays
- ✅ Icon present (📚)
- ✅ Helpful message
- ✅ "Add Your First Paper" CTA
- ✅ Clicking CTA opens modal

#### Test 4.2: Empty Notes
**Type**: UX Test  
**Steps**:
1. Navigate to paper with no notes
2. View notes section

**Success Criteria**:
- ✅ Empty state in notes area
- ✅ Encouraging message
- ✅ Placeholder visible in textarea
- ✅ Clear what to do next
- ✅ Professional appearance

#### Test 4.3: Empty Search Results
**Type**: UX Test  
**Steps**:
1. Search for non-existent paper
2. View results

**Success Criteria**:
- ✅ Empty state shows
- ✅ Icon (🔍)
- ✅ "No papers found" message
- ✅ Suggestions (try different keywords)
- ✅ Can clear search easily

#### Test 4.4: Empty Tags
**Type**: UX Test  
**Steps**:
1. View paper with no tags
2. Check tags section

**Success Criteria**:
- ✅ "No tags yet" message
- ✅ Add tag input visible
- ✅ Clear how to add first tag
- ✅ Professional styling
- ✅ Encourages tagging

#### Test 4.5: Empty State Consistency
**Type**: Visual Test  
**Steps**:
1. Review all empty states
2. Check consistency

**Success Criteria**:
- ✅ Similar styling across all
- ✅ Consistent icon style
- ✅ Similar messaging tone
- ✅ All have CTAs or guidance
- ✅ Professional throughout

---

### 5. Observability (6 tests)

#### Test 5.1: Convex Logging - Paper Addition
**Type**: Logging Validation  
**Steps**:
1. Add paper from ArXiv
2. Check Convex dashboard logs

**Expected Logs**:
```
[ArXiv] Starting paper fetch: { input: "...", userId: "..." }
[ArXiv] Parsed ID: { arxivId: "..." }
[ArXiv] Metadata fetched: { title: "...", arxivId: "..." }
[ArXiv] PDF stored: { pdfStorageId: "...", arxivId: "..." }
[ArXiv] Success: { paperId: "...", arxivId: "...", duration: 3500 }
```

**Success Criteria**:
- ✅ All operations logged
- ✅ Start/end logged
- ✅ Duration captured
- ✅ Key data included
- ✅ Searchable in dashboard

#### Test 5.2: Convex Logging - Notes
**Type**: Logging Validation  
**Steps**:
1. Save notes
2. Check Convex logs

**Expected Logs**:
```
[Notes] Saving note: { paperId: "...", contentLength: 150 }
[Notes] Saved successfully: { noteId: "...", paperId: "..." }
```

**Success Criteria**:
- ✅ Note save logged
- ✅ Content length included
- ✅ Success logged
- ✅ IDs captured
- ✅ Timestamp accurate

#### Test 5.3: Convex Logging - Errors
**Type**: Error Logging Test  
**Steps**:
1. Trigger ArXiv fetch error
2. Trigger notes save error
3. Check logs

**Expected Logs**:
```
[ArXiv] Failed: { input: "...", error: "...", duration: 1500 }
[Notes] Save failed: { paperId: "...", error: "..." }
```

**Success Criteria**:
- ✅ Errors logged with console.error
- ✅ Error messages captured
- ✅ Context included
- ✅ Stack trace available
- ✅ Easy to debug from logs

#### Test 5.4: Vercel Analytics Installation
**Type**: Setup Validation  
**Steps**:
1. Check package.json for @vercel/analytics
2. Check app/layout.tsx for Analytics component
3. Deploy to Vercel
4. Check Vercel dashboard

**Success Criteria**:
- ✅ Package installed
- ✅ Analytics component added
- ✅ Appears in Vercel dashboard
- ✅ Data collection started
- ✅ No console errors

#### Test 5.5: Vercel Analytics - Core Web Vitals
**Type**: Performance Monitoring  
**Steps**:
1. Visit production site
2. Navigate through pages
3. Wait 24 hours
4. Check Vercel Analytics dashboard

**Success Criteria**:
- ✅ LCP data visible
- ✅ FID data visible
- ✅ CLS data visible
- ✅ Page load times shown
- ✅ Real user data collecting

#### Test 5.6: Error Rate Monitoring
**Type**: Monitoring Validation  
**Steps**:
1. Trigger some errors intentionally
2. Check Convex logs
3. Calculate error rate

**Success Criteria**:
- ✅ Errors easily identifiable in logs
- ✅ Can filter by error type
- ✅ Timestamps allow rate calculation
- ✅ Low error rate (< 1%)
- ✅ Actionable information

---

### 6. Pre-commit Hooks (4 tests)

#### Test 6.1: Prettier Formatting
**Type**: Code Quality Test  
**Steps**:
1. Mess up formatting in a file
2. Stage file (git add)
3. Commit
4. Check file formatting

**Success Criteria**:
- ✅ Prettier runs automatically
- ✅ File formatted correctly
- ✅ Commit completes
- ✅ No manual formatting needed
- ✅ Consistent style enforced

#### Test 6.2: ESLint Check
**Type**: Code Quality Test  
**Steps**:
1. Introduce linting error
2. Try to commit
3. Observe behavior

**Success Criteria**:
- ✅ ESLint runs on commit
- ✅ Errors displayed clearly
- ✅ Commit blocked if errors
- ✅ Auto-fix runs (if possible)
- ✅ Clear error messages

#### Test 6.3: Hook Performance
**Type**: Performance Test  
**Steps**:
1. Stage multiple files
2. Commit
3. Measure hook execution time

**Success Criteria**:
- ✅ Hook completes < 10 seconds
- ✅ No noticeable delay
- ✅ Feedback during execution
- ✅ Doesn't block workflow
- ✅ Runs only on staged files

#### Test 6.4: Hook Bypass (Emergency)
**Type**: Edge Case Test  
**Steps**:
1. Try to bypass hooks with --no-verify
2. Verify it works (for emergencies)

**Success Criteria**:
- ✅ Can bypass if needed
- ✅ Normal commits use hooks
- ✅ Emergency escape hatch works
- ✅ Documented in README
- ✅ Not encouraged

---

### 7. Production Deployment (12 tests)

#### Test 7.1: Convex Production Deploy
**Type**: Deployment Test  
**Steps**:
1. Run `npx convex deploy`
2. Check Convex dashboard
3. Note production URL

**Success Criteria**:
- ✅ Deploy completes successfully
- ✅ Production deployment shown in dashboard
- ✅ Functions deployed
- ✅ Schema deployed
- ✅ URL active

#### Test 7.2: Vercel Project Setup
**Type**: Deployment Test  
**Steps**:
1. Connect GitHub repo to Vercel
2. Configure settings
3. Set environment variables
4. Deploy

**Success Criteria**:
- ✅ Project connected
- ✅ Next.js detected automatically
- ✅ Root directory set correctly (goodpapers/)
- ✅ Build command correct
- ✅ Environment variables set

#### Test 7.3: Production Build
**Type**: Build Test  
**Steps**:
1. Trigger Vercel build
2. Monitor build logs
3. Check for errors

**Success Criteria**:
- ✅ Build completes successfully
- ✅ No TypeScript errors
- ✅ No build warnings (critical ones)
- ✅ Build time < 5 minutes
- ✅ Deployment succeeds

#### Test 7.4: Production Environment Variables
**Type**: Configuration Test  
**Steps**:
1. Check Vercel env vars
2. Check Convex env vars
3. Verify all set correctly

**Required Variables**:

**Vercel**:
```
NEXT_PUBLIC_CONVEX_URL=https://impartial-wolf-773.convex.cloud
```

**Convex**:
```
AUTH_GOOGLE_ID=<client_id>
AUTH_GOOGLE_SECRET=<client_secret>
```

**Success Criteria**:
- ✅ All variables set
- ✅ Values correct
- ✅ No typos
- ✅ Secrets hidden
- ✅ Available at runtime

#### Test 7.5: Google OAuth Production Config
**Type**: Auth Test  
**Steps**:
1. Get production Vercel URL
2. Add to Google OAuth redirect URIs
3. Test sign-in on production

**Redirect URIs**:
```
https://[vercel-app].vercel.app/api/auth/callback/google
https://impartial-wolf-773.convex.site/api/auth/callback/google
```

**Success Criteria**:
- ✅ Redirect URIs added
- ✅ Sign-in works on production
- ✅ Redirects back correctly
- ✅ Session established
- ✅ User info displayed

#### Test 7.6: Production Homepage Load
**Type**: E2E Test (Production)  
**Steps**:
1. Visit production URL
2. Observe homepage load
3. Check console

**Success Criteria**:
- ✅ Homepage loads
- ✅ Redirects to sign-in (if not logged in)
- ✅ No console errors
- ✅ Loads < 3 seconds
- ✅ Looks professional

#### Test 7.7: Production Add Paper
**Type**: E2E Test (Production)  
**Steps**:
1. Sign in to production
2. Click "Add Paper"
3. Add: https://arxiv.org/abs/1706.03762
4. Verify paper appears

**Success Criteria**:
- ✅ Modal opens
- ✅ Can paste URL
- ✅ Submit works
- ✅ PDF downloads
- ✅ Paper appears in list
- ✅ Success toast shows

#### Test 7.8: Production PDF Viewer
**Type**: E2E Test (Production) - CRITICAL  
**Steps**:
1. Click on paper in production
2. Navigate to detail page
3. **Verify PDF loads** (was blocked in dev)
4. Test controls

**Success Criteria**:
- ✅ PDF loads successfully
- ✅ NO CSP errors in console
- ✅ Page navigation works
- ✅ Zoom controls work
- ✅ Rendering quality good
- **THIS IS THE CRITICAL TEST - PDF MUST WORK**

#### Test 7.9: Production Notes & Metadata
**Type**: E2E Test (Production)  
**Steps**:
1. On paper detail page
2. Add notes
3. Wait for auto-save
4. Change status
5. Add tags
6. Refresh page

**Success Criteria**:
- ✅ Notes save
- ✅ Auto-save works
- ✅ Status updates
- ✅ Tags save
- ✅ Changes persist after refresh
- ✅ Real-time updates work

#### Test 7.10: Production Search
**Type**: E2E Test (Production)  
**Steps**:
1. Add 2-3 papers
2. Use search bar
3. Filter by status
4. Verify results

**Success Criteria**:
- ✅ Search finds papers
- ✅ Results relevant
- ✅ Fast (< 1s)
- ✅ Filters work
- ✅ Can clear search

#### Test 7.11: Production Sign-Out
**Type**: E2E Test (Production)  
**Steps**:
1. Click user menu
2. Click "Sign out"
3. Verify redirect
4. Try to access protected route

**Success Criteria**:
- ✅ Signs out successfully
- ✅ Redirects to sign-in
- ✅ Session cleared
- ✅ Protected routes blocked
- ✅ Can sign in again

#### Test 7.12: Production Console Check
**Type**: Quality Assurance  
**Steps**:
1. Open DevTools on production
2. Navigate through all pages
3. Perform all actions
4. Monitor console

**Success Criteria**:
- ✅ Zero console errors
- ✅ Zero console warnings (critical ones)
- ✅ No 404s
- ✅ No failed requests
- ✅ Production-ready

---

### 8. Performance & Core Web Vitals (8 tests)

#### Test 8.1: Lighthouse Audit - Homepage
**Type**: Performance Test  
**Steps**:
1. Open Chrome DevTools
2. Navigate to homepage
3. Run Lighthouse audit
4. Check scores

**Success Criteria**:
- ✅ Performance: > 90
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ SEO: > 90
- ✅ No critical issues

#### Test 8.2: Lighthouse Audit - Paper Detail
**Type**: Performance Test  
**Steps**:
1. Navigate to paper detail
2. Run Lighthouse audit
3. Check scores

**Success Criteria**:
- ✅ Performance: > 85 (PDF loading considered)
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ No blockers
- ✅ PDF doesn't hurt score severely

#### Test 8.3: LCP (Largest Contentful Paint)
**Type**: Core Web Vitals Test  
**Steps**:
1. Open Performance tab in DevTools
2. Record page load
3. Find LCP metric
4. Measure across pages

**Success Criteria**:
- ✅ Homepage LCP: < 2.5s
- ✅ Paper detail LCP: < 2.5s
- ✅ Consistent across loads
- ✅ Good rating in Vercel Analytics
- ✅ No layout shifts

#### Test 8.4: FID (First Input Delay)
**Type**: Core Web Vitals Test  
**Steps**:
1. Load page
2. Immediately interact (click button)
3. Measure delay

**Success Criteria**:
- ✅ FID < 100ms
- ✅ Feels responsive
- ✅ No lag on interaction
- ✅ Good rating
- ✅ Consistent

#### Test 8.5: CLS (Cumulative Layout Shift)
**Type**: Core Web Vitals Test  
**Steps**:
1. Load page
2. Observe any shifts
3. Measure CLS score

**Success Criteria**:
- ✅ CLS < 0.1
- ✅ No visible shifts
- ✅ Skeleton loaders prevent shifts
- ✅ Images have dimensions
- ✅ Font loading smooth

#### Test 8.6: Bundle Size
**Type**: Performance Test  
**Steps**:
1. Check build output
2. Analyze bundle size
3. Check for large bundles

**Success Criteria**:
- ✅ First Load JS < 200 KB
- ✅ No single bundle > 500 KB
- ✅ Code splitting working
- ✅ react-pdf properly chunked
- ✅ Reasonable total size

#### Test 8.7: Network Performance
**Type**: Performance Test  
**Steps**:
1. Throttle network (Fast 3G)
2. Load homepage
3. Load paper detail
4. Measure performance

**Success Criteria**:
- ✅ Homepage usable on 3G
- ✅ Progressive loading
- ✅ Critical content first
- ✅ No blocking resources
- ✅ Acceptable UX on slow connection

#### Test 8.8: Vercel Analytics Validation
**Type**: Monitoring Test  
**Steps**:
1. Wait 24-48 hours after deploy
2. Check Vercel Analytics dashboard
3. Review metrics

**Success Criteria**:
- ✅ Core Web Vitals tracking
- ✅ LCP in green (< 2.5s)
- ✅ FID in green (< 100ms)
- ✅ CLS in green (< 0.1)
- ✅ Real user data available

---

## Test Execution Order

### Pre-Deployment Testing (Local - 30 min)

**Phase 1: PDF Viewer Fix Validation** (10 min)
1. Test 1.1: PDF Loads Successfully (CRITICAL)
2. Test 1.2: PDF Page Navigation
3. Test 1.3: PDF Zoom Controls
4. Test 1.4: PDF Worker Configuration
5. Test 1.10: CSP Headers Verification

**Phase 2: UI & Error Handling** (10 min)
6. Test 2.1-2.4: Color, Typography, Spacing, Hover
7. Test 2.5: Loading Skeletons
8. Test 3.1-3.3: Toast notifications and errors

**Phase 3: Features & Observability** (10 min)
9. Test 4.1-4.3: Empty states
10. Test 5.1-5.3: Convex logging
11. Test 6.1-6.2: Pre-commit hooks

### Deployment Testing (30 min)

**Phase 4: Deploy to Production** (10 min)
12. Test 7.1: Deploy Convex
13. Test 7.2-7.5: Vercel setup and OAuth config

**Phase 5: Production Validation** (15 min)
14. Test 7.6: Production homepage
15. Test 7.7: Production add paper
16. **Test 7.8: Production PDF viewer (CRITICAL)**
17. Test 7.9: Production notes & metadata
18. Test 7.12: Production console check

**Phase 6: Performance Validation** (5 min)
19. Test 8.1-8.2: Lighthouse audits
20. Test 8.3-8.5: Core Web Vitals

---

## Test Automation Script

```bash
#!/bin/bash
# test-per-14.sh

set -e

echo "🧪 PER-14 Testing Suite: Polish, Observability & Production Deployment"
echo "======================================================================="

cd goodpapers

# Phase 1: Configuration Checks
echo ""
echo "Phase 1: Configuration Validation"
echo "----------------------------------"

echo "✓ Checking next.config.ts for CSP headers..."
grep -q "Content-Security-Policy" next.config.ts && echo "  ✓ CSP headers present"
grep -q "worker-src.*blob" next.config.ts && echo "  ✓ worker-src includes blob"
grep -q "script-src.*unsafe-eval" next.config.ts && echo "  ✓ script-src allows unsafe-eval"

echo "✓ Checking Analytics installation..."
grep -q "@vercel/analytics" package.json && echo "  ✓ Vercel Analytics installed"
grep -q "Analytics" app/layout.tsx && echo "  ✓ Analytics component added"

echo "✓ Checking pre-commit hooks..."
test -f ".husky/pre-commit" && echo "  ✓ Husky pre-commit hook exists"
test -f ".prettierrc" && echo "  ✓ Prettier config exists"

# Phase 2: Build Validation
echo ""
echo "Phase 2: Build Validation"
echo "-------------------------"
npm run build && echo "  ✓ Production build succeeds"

# Phase 3: Type Checking
echo ""
echo "Phase 3: Type Checking"
echo "---------------------"
npx tsc --noEmit && echo "  ✓ No type errors"

# Phase 4: Component Validation
echo ""
echo "Phase 4: Component Validation"
echo "-----------------------------"
test -f "components/ui/Toast.tsx" && echo "  ✓ Toast component exists"
test -f "components/ui/ToastProvider.tsx" && echo "  ✓ ToastProvider exists"
test -f "components/ui/EmptyState.tsx" && echo "  ✓ EmptyState component exists"

echo ""
echo "✅ Automated pre-deployment tests passed!"
echo ""
echo "🔍 Next: Manual testing required"
echo "   1. Start dev server: npm run dev"
echo "   2. Test PDF viewer (CRITICAL - must load without CSP errors)"
echo "   3. Test UI polish and empty states"
echo "   4. Deploy to production"
echo "   5. Run production E2E tests"
```

---

## Manual Test Checklist

### Critical Tests (MUST PASS)

**PDF Viewer**:
- [ ] PDF loads without CSP errors
- [ ] Console is clean (no "Refused to create worker" errors)
- [ ] Page navigation works
- [ ] Zoom controls work
- [ ] Multiple PDFs can be loaded

**Production Deployment**:
- [ ] Build succeeds
- [ ] Vercel deployment works
- [ ] Google OAuth configured for production
- [ ] Production PDF viewer works (CRITICAL)
- [ ] No console errors in production

### UI Polish Tests

**Visual Quality**:
- [ ] Goodreads-inspired color scheme applied
- [ ] Typography hierarchy clear
- [ ] Consistent spacing throughout
- [ ] Hover states smooth
- [ ] Loading skeletons professional

**Empty States**:
- [ ] Empty paper list helpful
- [ ] Empty notes encouraging
- [ ] Empty search results clear
- [ ] All have CTAs or guidance

### Error Handling Tests

**Toast Notifications**:
- [ ] Success toasts show (green)
- [ ] Error toasts show (red)
- [ ] Auto-dismiss after 3s
- [ ] Can manually close

**Error Scenarios**:
- [ ] Invalid ArXiv URL shows error
- [ ] Network errors handled gracefully
- [ ] Auth errors redirect properly
- [ ] Notes save errors displayed

### Observability Tests

**Logging**:
- [ ] Paper addition logged to Convex
- [ ] Notes saves logged
- [ ] Errors logged with context
- [ ] Logs searchable in dashboard

**Analytics**:
- [ ] Vercel Analytics installed
- [ ] Appears in Vercel dashboard
- [ ] Core Web Vitals tracking

### Performance Tests

**Lighthouse Scores**:
- [ ] Homepage Performance > 90
- [ ] Paper Detail Performance > 85
- [ ] No critical issues

**Core Web Vitals**:
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

---

## Success Criteria Summary

### CRITICAL (Must Pass to Ship)
- ✅ PDF viewer loads without CSP errors
- ✅ Production deployment succeeds
- ✅ Google OAuth works in production
- ✅ Can add papers end-to-end
- ✅ Notes save successfully
- ✅ Zero console errors in production

### Important (Should Pass)
- ✅ UI looks polished and professional
- ✅ Toast notifications work
- ✅ Empty states helpful
- ✅ Convex logging implemented
- ✅ Vercel Analytics tracking
- ✅ Pre-commit hooks working

### Nice to Have (Can Iterate)
- ✅ Core Web Vitals all green
- ✅ Lighthouse scores > 90
- ✅ Perfect Goodreads aesthetic
- ✅ All animations smooth

---

## Expected Test Duration

- **Automated tests**: 5 minutes
- **PDF viewer validation**: 10 minutes (CRITICAL)
- **UI polish testing**: 10 minutes
- **Error handling testing**: 10 minutes
- **Production deployment**: 15 minutes
- **Production E2E testing**: 15 minutes
- **Performance validation**: 10 minutes
- **Total**: ~75 minutes (includes deployment time)

---

## Test Exit Criteria

**Ready to Ship** when:

✅ **PDF Viewer Works**:
- PDF loads in dev without CSP errors
- PDF loads in production without CSP errors
- All controls work
- Rendering quality good

✅ **Production Validates**:
- Vercel deployment succeeds
- Google OAuth works
- Can add papers
- Can view PDFs
- Can take notes
- No console errors

✅ **Quality Checks**:
- UI polished
- Error handling comprehensive
- Monitoring in place
- Performance acceptable

---

## Known Issues to Verify Fixed

From PER-13 testing, these MUST be resolved:

### 1. PDF Viewer CSP Blocking ✅ FIXED
**Before**:
```
❌ Refused to create a worker from 'blob:http://localhost:3000/...'
❌ Refused to load the script 'https://cdnjs.cloudflare.com/...'
```

**After (Expected)**:
```
✅ PDF loads successfully
✅ No CSP errors
✅ Clean console
```

**How to Verify**: Load paper detail page and check browser console.

---

## Post-Deployment Monitoring

**First 24 Hours**:
- [ ] Check Convex logs for errors
- [ ] Monitor Vercel Analytics
- [ ] Watch for auth issues
- [ ] Check Core Web Vitals trends
- [ ] Verify no user-reported bugs

**First Week**:
- [ ] Review error rates
- [ ] Check performance trends
- [ ] Gather user feedback
- [ ] Monitor costs (Vercel/Convex)

---

## Next Steps After PER-14

Once PER-14 is complete and tested:

1. **PER-15**: Final Launch & User Testing
   - Beta user testing
   - Bug fixes
   - Final optimizations
   - Launch announcement

---

## Notes for Testing

- **Use real ArXiv papers** for testing (e.g., 1706.03762)
- **Test in Chrome DevTools** with console open always
- **Monitor Convex dashboard** during testing
- **Check Vercel Analytics** after 24 hours
- **The PDF viewer fix is THE critical test** - everything else is polish

---

**Testing Priority**: Fix PDF viewer first, then everything else! 🚀

