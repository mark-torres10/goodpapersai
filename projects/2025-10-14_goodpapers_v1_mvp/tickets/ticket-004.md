# Ticket-004: PER-11 Testing & Validation

**Ticket**: PER-11 - Frontend Auth & Core Layout Testing  
**Status**: Proposed (Awaiting Approval)  
**Created**: 2025-10-15  
**Estimated Time**: 45 minutes  
**Dependencies**: PER-8, PER-9, PER-10 complete

---

## Objective

Comprehensive testing and validation of PER-11 (Frontend Auth & Core Layout) to ensure Google OAuth authentication, session management, protected routes, and UI components all work correctly and meet specification requirements.

---

## Test Coverage Areas

### 1. Google OAuth Authentication (8 tests)
### 2. Session Management (6 tests)
### 3. Protected Routes (5 tests)
### 4. UI Components (7 tests)
### 5. Error Handling (5 tests)
### 6. Integration & Performance (4 tests)

**Total: 35 automated + manual tests**

---

## Detailed Test Plan

### 1. Google OAuth Authentication (8 tests)

#### Test 1.1: Sign In with Google - Happy Path
**Type**: Manual Browser Test (Browser MCP)  
**Steps**:
1. Navigate to http://localhost:3000
2. Should redirect to /sign-in
3. Click "Continue with Google" button
4. OAuth popup/redirect appears

**Success Criteria**:
- Sign-in page loads correctly
- Google button is styled and functional
- OAuth redirect happens
- No console errors

#### Test 1.2: OAuth Authorization Flow
**Type**: Manual Browser Test  
**Steps**:
1. In Google OAuth screen, select account
2. Authorize the application
3. Redirected back to application

**Success Criteria**:
- Google account selection screen appears
- Authorization prompt shows correct app name
- Successful redirect to homepage after authorization
- No error pages

#### Test 1.3: User Info Display After Sign-In
**Type**: Manual Browser Test  
**Steps**:
1. After successful sign-in
2. Check header for user info

**Success Criteria**:
- User name displays in header
- User avatar/image displays correctly
- User email visible in dropdown menu
- All info matches Google account

#### Test 1.4: First-Time User Creation
**Type**: Database Test  
**Steps**:
1. Sign in with new Google account
2. Check Convex dashboard → Data → users table

**Success Criteria**:
- New user record created automatically
- Fields populated: name, email, image, createdAt
- User ID generated correctly
- emailVerified set appropriately

#### Test 1.5: Returning User Recognition
**Type**: Database Test  
**Steps**:
1. Sign out
2. Sign in again with same Google account
3. Check users table

**Success Criteria**:
- No duplicate user record created
- Existing user record used
- User data unchanged
- Session created with existing userId

#### Test 1.6: OAuth Error Handling
**Type**: Error Test  
**Steps**:
1. Cancel OAuth flow (click "Cancel" in Google screen)
2. Or deny authorization

**Success Criteria**:
- Gracefully returns to sign-in page
- Error message displayed (if applicable)
- Can retry sign-in
- No application crash

#### Test 1.7: Invalid OAuth Credentials
**Type**: Configuration Test  
**Steps**:
1. Temporarily set invalid AUTH_GOOGLE_ID in Convex
2. Try to sign in

**Success Criteria**:
- Clear error message about OAuth configuration
- No cryptic error codes
- Helpful debugging information in console
- Application doesn't crash

#### Test 1.8: OAuth Redirect URI Validation
**Type**: Configuration Test  
**Verify**:
- Redirect URI in Google Cloud Console matches Convex deployment URL
- Pattern: `https://impartial-wolf-773.convex.site/api/auth/callback/google`

**Success Criteria**:
- Exact match between configured and actual redirect URI
- OAuth flow completes successfully
- No "redirect_uri_mismatch" errors

---

### 2. Session Management (6 tests)

#### Test 2.1: Session Persistence Across Page Reloads
**Type**: Browser Test  
**Steps**:
1. Sign in successfully
2. Refresh page (F5 or Cmd+R)
3. Check authentication state

**Success Criteria**:
- User stays authenticated after reload
- No redirect to sign-in
- User info still displays
- No re-authentication required

#### Test 2.2: Session Persistence Across Browser Tabs
**Type**: Browser Test  
**Steps**:
1. Sign in in Tab 1
2. Open new tab (Tab 2)
3. Navigate to http://localhost:3000 in Tab 2

**Success Criteria**:
- Tab 2 shows authenticated state
- User info displays without re-sign-in
- Both tabs share same session

#### Test 2.3: Session Persistence Across Browser Restarts
**Type**: Manual Browser Test  
**Steps**:
1. Sign in successfully
2. Close all browser windows
3. Reopen browser
4. Navigate to http://localhost:3000

**Success Criteria**:
- User stays authenticated (if session not expired)
- User info displays
- No re-authentication needed

#### Test 2.4: Session Expiration Handling
**Type**: Manual Test (if expiration can be simulated)  
**Steps**:
1. Sign in
2. Wait for session to expire (or manually invalidate token)
3. Try to access protected route

**Success Criteria**:
- Redirected to sign-in when session expired
- Clear message about session expiration
- Can sign in again
- No data loss

#### Test 2.5: Concurrent Session Management
**Type**: Browser Test  
**Steps**:
1. Sign in as User A in Browser 1
2. Sign in as different User B in Browser 2 (incognito)
3. Verify both sessions work independently

**Success Criteria**:
- Both users authenticated separately
- No session conflicts
- Each sees their own data
- Sign-out in one doesn't affect other

#### Test 2.6: Token Storage Security
**Type**: Security Test  
**Steps**:
1. Sign in
2. Open browser DevTools → Application/Storage
3. Check localStorage, sessionStorage, cookies

**Success Criteria**:
- Auth tokens stored securely
- No sensitive data in plain text
- HttpOnly cookies used (if applicable)
- Tokens not accessible via JavaScript (if using HttpOnly)

---

### 3. Protected Routes (5 tests)

#### Test 3.1: Unauthenticated Access to Homepage
**Type**: Browser Test  
**Steps**:
1. Clear all cookies/storage (sign out)
2. Navigate to http://localhost:3000
3. Check behavior

**Success Criteria**:
- Redirected to /sign-in immediately
- No flash of protected content
- Redirect is smooth (no layout shift)

#### Test 3.2: Unauthenticated Access to Non-Existent Route
**Type**: Browser Test  
**Steps**:
1. While signed out
2. Navigate to http://localhost:3000/some-random-route

**Success Criteria**:
- Redirected to /sign-in (or 404 after sign-in)
- Proper error handling
- No application crash

#### Test 3.3: Authenticated Access to Sign-In Page
**Type**: Browser Test  
**Steps**:
1. Sign in successfully
2. Manually navigate to /sign-in

**Success Criteria**:
- Either: Shows "Already signed in" message
- Or: Redirects to homepage
- No OAuth flow triggered again

#### Test 3.4: Direct URL Access While Authenticated
**Type**: Browser Test  
**Steps**:
1. Sign in
2. Directly navigate to http://localhost:3000 via URL bar
3. Check if homepage loads without redirect

**Success Criteria**:
- Homepage loads immediately
- No redirect to sign-in
- User info displays
- Protected content visible

#### Test 3.5: Back Button After Sign-In
**Type**: Browser Navigation Test  
**Steps**:
1. Navigate to / → redirected to /sign-in
2. Sign in → redirected back to /
3. Click browser back button

**Success Criteria**:
- Does not go back to sign-in page
- Stays on homepage (or shows appropriate page)
- No redirect loop
- Session still valid

---

### 4. UI Components (7 tests)

#### Test 4.1: Sign-In Page Rendering
**Type**: Visual Test (Browser MCP)  
**Check**:
- Sign-in page layout correct
- "Goodpapers" title displays
- Subtitle/description present
- Google button renders with icon
- Background gradient applied
- Centered card layout
- Professional appearance

**Success Criteria**:
- All elements render correctly
- No missing images or icons
- Styling matches Goodreads aesthetic
- Responsive on mobile (test at 375px width)

#### Test 4.2: Header Component Rendering
**Type**: Visual Test  
**Check**:
- Header displays at top of page
- Logo/brand name present
- User menu visible when authenticated
- Proper spacing and alignment
- Border styling correct

**Success Criteria**:
- Header sticky or fixed position (optional)
- Logo clickable (links to /)
- User menu aligned right
- Responsive design works

#### Test 4.3: User Menu Dropdown Functionality
**Type**: Interaction Test (Browser MCP)  
**Steps**:
1. Click user menu button
2. Dropdown should appear
3. Click outside dropdown
4. Dropdown should close

**Success Criteria**:
- Dropdown opens on click
- Dropdown closes on outside click
- Sign out button visible in dropdown
- User info displayed in dropdown
- Smooth animations

#### Test 4.4: User Avatar Display
**Type**: Visual Test  
**Check**:
- User's Google profile image loads
- Image is circular (rounded-full)
- Appropriate size (32px x 32px in header)
- No broken image icon
- Fallback if no image

**Success Criteria**:
- Avatar loads from Google
- Proper aspect ratio
- No image distortion
- Fast loading (cached)

#### Test 4.5: Loading States During Auth
**Type**: Interaction Test  
**Steps**:
1. Click "Continue with Google"
2. Observe button state before OAuth redirect

**Success Criteria**:
- Button shows loading state
- Text changes to "Signing in..."
- Button disabled during loading
- Spinner or loading indicator (optional)
- No double-click issues

#### Test 4.6: Responsive Design - Mobile
**Type**: Responsive Test (Browser MCP)  
**Steps**:
1. Resize browser to mobile width (375px)
2. Check sign-in page
3. Check header/navigation
4. Check user menu

**Success Criteria**:
- Sign-in page readable on mobile
- Header doesn't overflow
- User menu still accessible
- Font sizes appropriate
- Touch targets large enough (44px minimum)

#### Test 4.7: Responsive Design - Desktop
**Type**: Responsive Test  
**Steps**:
1. View at desktop width (1920px)
2. Check all layouts

**Success Criteria**:
- Content centered with max-width
- Appropriate spacing
- No excessively long lines of text
- Professional appearance

---

### 5. Error Handling (5 tests)

#### Test 5.1: Network Failure During Sign-In
**Type**: Error Test  
**Steps**:
1. Block network (DevTools → Network → Offline)
2. Try to sign in

**Success Criteria**:
- Clear error message about network
- Can retry when network restored
- No application crash
- Loading state clears

#### Test 5.2: OAuth Callback Error
**Type**: Error Test  
**Steps**:
1. Simulate OAuth callback with error parameter
2. Navigate to callback URL with ?error=access_denied

**Success Criteria**:
- Error displayed to user
- Can return to sign-in and retry
- Error logged for debugging
- No sensitive info exposed

#### Test 5.3: Missing Environment Variables
**Type**: Configuration Test  
**Steps**:
1. Remove AUTH_GOOGLE_ID from Convex environment
2. Try to sign in

**Success Criteria**:
- Clear error about missing configuration
- Helpful message for developer
- Application doesn't crash
- Can fix and retry

#### Test 5.4: Malformed User Data
**Type**: Edge Case Test  
**Steps**:
1. Sign in with account that has minimal data (no name, no image)
2. Check UI rendering

**Success Criteria**:
- No crashes with missing user fields
- Fallback name displayed (e.g., "User")
- Fallback avatar shown or text initials
- Email still displays

#### Test 5.5: Sign-Out Error Handling
**Type**: Error Test  
**Steps**:
1. Simulate network failure during sign-out
2. Try to sign out

**Success Criteria**:
- Error message displayed
- Can retry sign-out
- If sign-out fails, user can still use app
- Clear session locally even if server call fails

---

### 6. Integration & Performance (4 tests)

#### Test 6.1: End-to-End Auth Flow Timing
**Type**: Performance Test  
**Test**: Time from clicking "Sign in" to seeing authenticated homepage

**Success Criteria**:
- Total time < 30 seconds (spec requirement)
- OAuth redirect: < 5s
- Callback processing: < 2s
- Homepage render: < 2s
- User perceives smooth experience

#### Test 6.2: Convex Auth Integration with PER-9 Schema
**Type**: Integration Test  
**Steps**:
1. Sign in as new user
2. Check users table in Convex dashboard
3. Verify user fields match schema

**Success Criteria**:
- User created in correct table
- All schema fields populated
- createdAt timestamp set
- No schema validation errors

#### Test 6.3: Auth State with Backend Queries
**Type**: Integration Test  
**Steps**:
1. Sign in
2. Check that backend queries receive userId
3. Verify queries return user-specific data

**Success Criteria**:
- Authenticated queries work
- userId passed correctly to backend
- User can only see their own data
- No unauthorized access

#### Test 6.4: Bundle Size & Performance
**Type**: Performance Test  
**Test**: Build and analyze bundle

```bash
npm run build
```

**Success Criteria**:
- Auth bundle size reasonable (< 100kB additional)
- No duplicate Convex clients
- Tree-shaking works for unused auth components
- Page load time < 2s (spec requirement)

---

## Test Execution Order

### Phase 1: Configuration & Setup (5 min)
1. Verify Google OAuth credentials configured
2. Check environment variables in Convex
3. Verify build passes

### Phase 2: Component Rendering (10 min)
4. Sign-in page rendering (4.1)
5. Header component rendering (4.2)
6. User menu rendering (4.3)
7. Avatar display (4.4)
8. Loading states (4.5)
9. Responsive design (4.6, 4.7)

### Phase 3: Authentication Flow (15 min)
10. Sign in with Google (1.1, 1.2)
11. User info display (1.3)
12. First-time user creation (1.4)
13. Returning user recognition (1.5)
14. OAuth error handling (1.6, 1.7, 1.8)

### Phase 4: Session Management (10 min)
15. Session persistence tests (2.1, 2.2, 2.3)
16. Session expiration (2.4)
17. Concurrent sessions (2.5)
18. Token security (2.6)

### Phase 5: Protected Routes (5 min)
19. Route protection tests (3.1-3.5)

### Phase 6: Error & Performance (10 min)
20. Error handling tests (5.1-5.5)
21. Performance tests (6.1-6.4)

---

## Test Automation Script

```bash
#!/bin/bash
# test-per-11.sh

set -e

echo "🧪 PER-11 Testing Suite: Frontend Auth & Core Layout"
echo "===================================================="

cd goodpapers

# Phase 1: File Structure
echo ""
echo "Phase 1: File Structure"
echo "----------------------"

echo "✓ Checking authentication files..."
test -f "app/ConvexClientProvider.tsx" && echo "  ✓ ConvexClientProvider.tsx exists"
test -f "app/sign-in/page.tsx" && echo "  ✓ sign-in/page.tsx exists"
test -f "components/auth/SignInForm.tsx" && echo "  ✓ SignInForm.tsx exists"
test -f "components/auth/UserMenu.tsx" && echo "  ✓ UserMenu.tsx exists"
test -f "components/auth/ProtectedRoute.tsx" && echo "  ✓ ProtectedRoute.tsx exists"
test -f "components/layout/Header.tsx" && echo "  ✓ Header.tsx exists"
test -f "components/layout/AppLayout.tsx" && echo "  ✓ AppLayout.tsx exists"
test -f "convex/users.ts" && echo "  ✓ users.ts exists"

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

# Phase 4: Convex Deployment
echo ""
echo "Phase 4: Convex Deployment"
echo "-------------------------"
npx convex dev --once && echo "  ✓ Convex functions deployed"

# Phase 5: Grep Checks
echo ""
echo "Phase 5: Component Validation"
echo "-----------------------------"
grep -q "ConvexAuthNextjsProvider" "app/ConvexClientProvider.tsx" && echo "  ✓ ConvexAuthNextjsProvider used"
grep -q "useAuthActions" "components/auth/SignInForm.tsx" && echo "  ✓ useAuthActions hook used"
grep -q "Authenticated" "components/layout/Header.tsx" && echo "  ✓ Authenticated wrapper used"
grep -q "ProtectedRoute" "app/page.tsx" && echo "  ✓ Homepage protected"

echo ""
echo "✅ Automated tests passed!"
echo ""
echo "🔍 Next: Manual testing in browser required"
echo "   1. Start dev server: npm run dev"
echo "   2. Navigate to: http://localhost:3000"
echo "   3. Test sign-in flow with Google"
echo "   4. Test sign-out flow"
echo "   5. Verify session persistence"
```

---

## Manual Test Checklist

### Browser Testing (Browser MCP)

**Setup**:
- [ ] Start dev server: `npm run dev`
- [ ] Open browser to http://localhost:3000
- [ ] Open browser console (check for errors)
- [ ] Have Google account ready for testing

**Sign-In Flow**:
- [ ] Homepage redirects to /sign-in (unauthenticated)
- [ ] Sign-in page displays correctly with Google button
- [ ] Click "Continue with Google"
- [ ] Google OAuth screen appears
- [ ] Select Google account
- [ ] Authorize application
- [ ] Redirected back to homepage (authenticated)
- [ ] User name displays in header
- [ ] User avatar displays in header

**User Interface**:
- [ ] Header displays correctly
- [ ] Logo is visible and clickable
- [ ] User menu button is visible
- [ ] Click user menu → dropdown opens
- [ ] User info displays in dropdown (name, email)
- [ ] Sign out button visible in dropdown
- [ ] Click outside → dropdown closes
- [ ] Responsive design works (resize browser)

**Session Persistence**:
- [ ] Refresh page (F5) → stay authenticated
- [ ] Open new tab → navigate to / → authenticated
- [ ] Close tab, reopen → still authenticated
- [ ] Check browser console → no errors

**Sign-Out Flow**:
- [ ] Click user menu
- [ ] Click "Sign out"
- [ ] Redirected to /sign-in
- [ ] User info cleared from UI
- [ ] Try to access / → redirected to /sign-in
- [ ] Can sign in again successfully

**Error Handling**:
- [ ] Test OAuth cancellation (click Cancel in Google screen)
- [ ] Returns to sign-in page gracefully
- [ ] Can retry sign-in
- [ ] No console errors (except expected auth errors)

**Performance**:
- [ ] Sign-in completes in < 30 seconds (spec requirement)
- [ ] No hydration errors in console
- [ ] No layout shift during loading
- [ ] Smooth animations and transitions

---

## Convex Dashboard Testing

**Setup**:
- [ ] Navigate to https://dashboard.convex.dev
- [ ] Select project: impartial-wolf-773
- [ ] Go to Data tab

**User Creation Test**:
- [ ] Sign in with new Google account (use incognito)
- [ ] Check Data → users table
- [ ] Verify new user record created with:
  - name (from Google)
  - email (from Google)
  - image (Google profile picture URL)
  - createdAt (timestamp)
- [ ] Verify no duplicate user on second sign-in

**getCurrentUser Query Test**:
- [ ] Go to Functions tab
- [ ] Run `users.getCurrentUser` query (no args)
- [ ] Should return current authenticated user
- [ ] Verify all fields populated correctly

**Environment Variables Check**:
- [ ] Go to Settings → Environment Variables
- [ ] Verify `AUTH_GOOGLE_ID` is set
- [ ] Verify `AUTH_GOOGLE_SECRET` is set
- [ ] Values should be hidden (security)

---

## Test Scenarios with Expected Results

### Scenario 1: New User First Sign-In
**Steps**:
1. Clear all cookies/storage
2. Navigate to http://localhost:3000
3. Click "Continue with Google"
4. Authorize with new Google account

**Expected Result**:
```
1. Redirect to /sign-in ✓
2. Google OAuth screen appears ✓
3. User authorizes app ✓
4. Redirect back to http://localhost:3000 ✓
5. User record created in database ✓
6. Homepage displays with user info ✓
7. Header shows user name and avatar ✓
```

**Database State**:
```json
// users table should have new entry:
{
  "_id": "<generated_id>",
  "name": "Test User",
  "email": "test@gmail.com",
  "image": "https://lh3.googleusercontent.com/...",
  "createdAt": 1697414400000
}
```

### Scenario 2: Returning User Sign-In
**Steps**:
1. Sign out
2. Sign in again with same Google account

**Expected Result**:
```
1. OAuth flow completes ✓
2. Existing user record used (no duplicate) ✓
3. Session created with existing userId ✓
4. Homepage displays immediately ✓
5. User info correct ✓
```

### Scenario 3: Session Persistence
**Steps**:
1. Sign in
2. Refresh page

**Expected Result**:
```
1. Page reloads ✓
2. User stays authenticated ✓
3. No redirect to /sign-in ✓
4. User info displays immediately ✓
5. No flash of unauthenticated content ✓
```

### Scenario 4: Protected Route Access
**Steps**:
1. Sign out
2. Try to access http://localhost:3000

**Expected Result**:
```
1. Immediate redirect to /sign-in ✓
2. No flash of protected content ✓
3. Sign in ✓
4. Redirect back to / ✓
5. Protected content now visible ✓
```

---

## Browser MCP Test Commands

Use Browser MCP for automated UI testing:

### Test 1: Sign-In Page Rendering
```typescript
// Navigate to sign-in page
browser.navigate("http://localhost:3000/sign-in");

// Take screenshot
browser.screenshot("sign-in-page.png");

// Check for elements
browser.snapshot(); // Get accessibility tree

// Verify elements exist:
// - Heading "Goodpapers"
// - Button "Continue with Google"
// - Description text
```

### Test 2: Header Component
```typescript
// Sign in first, then:
browser.navigate("http://localhost:3000");

// Take screenshot
browser.screenshot("authenticated-homepage.png");

// Verify header elements:
// - Logo/brand name
// - User menu button
```

### Test 3: User Menu Interaction
```typescript
// Click user menu
browser.click({ element: "User menu button", ref: "<ref>" });

// Verify dropdown visible
browser.snapshot();

// Click sign out
browser.click({ element: "Sign out button", ref: "<ref>" });

// Verify redirect to sign-in
```

### Test 4: Responsive Testing
```typescript
// Resize to mobile
browser.resize({ width: 375, height: 667 });
browser.screenshot("mobile-sign-in.png");

// Resize to desktop
browser.resize({ width: 1920, height: 1080 });
browser.screenshot("desktop-homepage.png");
```

---

## Success Criteria Summary

### Automated Tests (8 tests)
- [ ] File structure tests pass
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Convex deployment succeeds
- [ ] Component validation (grep checks)

### Manual Browser Tests (27 tests)
- [ ] Google OAuth flow works (8/8)
- [ ] Session management works (6/6)
- [ ] Protected routes work (5/5)
- [ ] UI components render correctly (7/7)
- [ ] Error handling works (5/5)
- [ ] Integration & performance acceptable (4/4)

---

## Expected Test Duration

- **Automated tests**: 5 minutes
- **OAuth configuration**: 10 minutes
- **Manual browser tests**: 20 minutes
- **Performance validation**: 5 minutes
- **Documentation**: 5 minutes
- **Total**: 45 minutes

---

## Test Data Requirements

### Google Account for Testing
- Need valid Google account for OAuth testing
- Recommend using personal Google account initially
- Can test with multiple accounts for multi-session testing

### Test User Data
After first sign-in, user record should contain:
```json
{
  "name": "Mark Torres",
  "email": "mark@example.com",
  "image": "https://lh3.googleusercontent.com/a/...",
  "createdAt": 1697414400000
}
```

---

## Failure Handling

If any test fails:

### OAuth Issues
1. **Error**: "redirect_uri_mismatch"
   - **Fix**: Verify redirect URI in Google Console matches exactly
   - **Pattern**: `https://impartial-wolf-773.convex.site/api/auth/callback/google`

2. **Error**: "invalid_client"
   - **Fix**: Check AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in Convex
   - **Verify**: Credentials match Google Cloud Console

3. **Error**: OAuth popup blocked
   - **Fix**: Allow popups for localhost in browser settings
   - **Alternative**: Use redirect flow instead of popup

### Hydration Issues
1. **Error**: "Text content does not match server-rendered HTML"
   - **Fix**: Ensure "use client" directive on Client Components
   - **Check**: ConvexAuthNextjsProvider is client-side only
   - **Verify**: No conditional rendering based on client-only state

### Session Issues
1. **Error**: Session not persisting
   - **Fix**: Check Convex Auth token storage
   - **Verify**: Cookies enabled in browser
   - **Debug**: Check browser DevTools → Application → Cookies

### Component Issues
1. **Error**: User menu not opening
   - **Fix**: Check ref and useEffect dependencies
   - **Verify**: Click handler attached correctly
   - **Debug**: Console log click events

---

## Performance Benchmarks

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Sign-in flow time | < 30s | Stopwatch from click to authenticated |
| Page load (authenticated) | < 2s | Browser DevTools → Network tab |
| User menu dropdown | < 100ms | Visual observation |
| Sign-out time | < 2s | Time from click to redirect |
| Bundle size increase | < 100kB | `npm run build` output |

---

## References

- **Spec**: `/projects/2025-10-14_goodpapers_v1_mvp/spec.md`
- **PER-11 Plan**: `/projects/2025-10-14_goodpapers_v1_mvp/PER-11_execution_plan.md`
- **Convex Auth Docs**: https://labs.convex.dev/auth
- **Convex Auth Next.js**: https://labs.convex.dev/auth/setup/nextjs
- **Google OAuth Setup**: https://console.cloud.google.com
- **Next.js Font Optimization**: https://nextjs.org/docs/app/building-your-application/optimizing/fonts

---

## Post-Testing Actions

After all tests pass:
1. Document test results in `logs.md`
2. Update Linear ticket PER-11 to "Ready for Review"
3. Create test results summary with screenshots
4. Document any OAuth quirks or gotchas encountered
5. Proceed with PER-12 (Home Page implementation)

---

## Known Issues & Workarounds

### Issue 1: OAuth Popup Blocked in Some Browsers
**Workaround**: Use redirect flow instead of popup
**Impact**: Slight UX difference but same functionality

### Issue 2: Development vs. Production OAuth URIs
**Solution**: Configure both URIs in Google Console
**Note**: Remember to update production URI when deploying

### Issue 3: User Info Might Not Load Immediately
**Solution**: Show loading state in UserMenu while querying
**Pattern**: Use `isLoading` state from useQuery

---

## Critical Path Items

**Must Work for PER-11 to be Complete**:
- ✅ Google OAuth sign-in succeeds
- ✅ Session persists across page reloads
- ✅ Sign-out works and clears session
- ✅ Protected routes redirect correctly
- ✅ User info displays in header
- ✅ No hydration errors in console

**Can Be Refined Later**:
- User menu animations
- Loading spinner styles
- Error message copy
- Responsive design edge cases

---

## Integration Validation

### With PER-9 (Backend Schema)
- [ ] User table schema matches auth data
- [ ] getCurrentUser query works
- [ ] userId available for paper queries
- [ ] No schema validation errors

### With PER-10 (ArXiv Integration)
- [ ] Auth state available in actions
- [ ] userId can be passed to addPaperFromArxiv
- [ ] Papers associated with correct user

### With Next.js (PER-8)
- [ ] next/font optimization works
- [ ] App Router navigation works
- [ ] Client/Server Component separation correct
- [ ] Build optimization working

---

## Test Exit Criteria

**All tests must pass** before proceeding to PER-12:

✅ **Authentication**:
- OAuth flow completes successfully
- User can sign in and sign out
- Session persists correctly

✅ **UI Components**:
- All components render without errors
- Responsive design works
- No hydration warnings

✅ **Integration**:
- Convex Auth integrates with backend
- User data stored correctly
- Protected routes work

✅ **Performance**:
- Sign-in time < 30s
- Page load < 2s
- Bundle size reasonable

✅ **Quality**:
- No TypeScript errors
- Build succeeds
- No console errors (except expected auth errors)

---

## Next Steps After PER-11

Once PER-11 is complete and tested:

1. **PER-12**: Home Page with Search & Paper List
   - Use authenticated user info
   - Display user-specific papers
   - Add paper button triggers addPaperFromArxiv action

2. **PER-13**: Paper Detail Page with PDF Viewer & Notes
   - Protected route for paper pages
   - User-specific paper access
   - Notes associated with userId

---

**Testing Focus**: Authentication flow must be rock-solid before building features on top! 🔒

