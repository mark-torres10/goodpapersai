# Ticket-001: PER-8 Testing & Validation

**Ticket**: PER-8 - Phase 1: Project Setup & Infrastructure Testing  
**Status**: Proposed (Awaiting Approval)  
**Created**: 2025-10-14  
**Estimated Time**: 30 minutes

---

## Objective

Comprehensive testing and validation of PER-8 (Project Setup & Infrastructure) to ensure all components are correctly configured, working together, and meeting the specification requirements.

---

## Test Coverage Areas

### 1. Build System Validation (5 tests)
### 2. TypeScript Configuration (3 tests)
### 3. Dependency Verification (4 tests)
### 4. Convex Integration (5 tests)
### 5. UI/Frontend Validation (5 tests - Browser MCP)
### 6. File Structure & Configuration (4 tests)

**Total: 26 automated tests**

---

## Detailed Test Plan

### 1. Build System Validation (5 tests)

#### Test 1.1: Production Build Success
**Type**: Build Test  
**Command**: `npm run build`  
**Success Criteria**:
- Exit code 0
- No TypeScript errors
- No build errors
- `.next/` directory created
- Build output shows compiled routes

#### Test 1.2: Development Server Start
**Type**: Process Test  
**Command**: `npm run dev`  
**Success Criteria**:
- Server starts without errors
- Listening on port 3000
- No compilation errors
- Process stays running (doesn't crash)

#### Test 1.3: Type Checking
**Type**: TypeScript Test  
**Command**: `npx tsc --noEmit`  
**Success Criteria**:
- No type errors
- Strict mode enforced
- All dependencies properly typed

#### Test 1.4: Linting
**Type**: ESLint Test  
**Command**: `npm run lint`  
**Success Criteria**:
- No linting errors
- ESLint config present
- Next.js ESLint rules applied

#### Test 1.5: Build Performance
**Type**: Performance Test  
**Command**: `npm run build` (timed)  
**Success Criteria**:
- Build completes in < 60 seconds
- No memory errors
- Turbopack active

---

### 2. TypeScript Configuration (3 tests)

#### Test 2.1: Strict Mode Enabled
**Type**: Config Test  
**File**: `tsconfig.json`  
**Success Criteria**:
- `"strict": true` is set
- Target is ES2017 or newer
- Module resolution is bundler

#### Test 2.2: Type Generation for Convex
**Type**: Integration Test  
**File**: `convex/_generated/`  
**Success Criteria**:
- Directory exists
- `dataModel.d.ts` generated
- `api.d.ts` generated
- No TypeScript errors in generated files

#### Test 2.3: Import Aliases Work
**Type**: Integration Test  
**Test**: Create a test import using `@/*` alias  
**Success Criteria**:
- Import resolves correctly
- TypeScript recognizes path
- Build succeeds with alias imports

---

### 3. Dependency Verification (4 tests)

#### Test 3.1: Core Dependencies Installed
**Type**: Package Test  
**File**: `package.json`  
**Success Criteria**:
- `next@15.5.5` present
- `react@19.1.0` present
- `react-dom@19.1.0` present
- `convex@^1.27.5` present
- `@convex-dev/auth@^0.0.90` present

#### Test 3.2: Application Dependencies Installed
**Type**: Package Test  
**Success Criteria**:
- `react-pdf@^10.2.0` present
- `react-markdown@^10.1.0` present
- `fast-xml-parser@^5.3.0` present

#### Test 3.3: Dev Dependencies Installed
**Type**: Package Test  
**Success Criteria**:
- `typescript@^5` present
- `tailwindcss@^4` present
- `@tailwindcss/postcss@^4` present
- `@types/react-pdf` present
- `eslint` present

#### Test 3.4: No Critical Vulnerabilities
**Type**: Security Test  
**Command**: `npm audit --audit-level=critical`  
**Success Criteria**:
- No critical vulnerabilities (excluding known PDF.js issue)
- Acceptable vulnerabilities documented

---

### 4. Convex Integration (5 tests)

#### Test 4.1: Convex Configuration Files Exist
**Type**: File Test  
**Success Criteria**:
- `convex.json` exists
- `convex/auth.ts` exists
- `convex/http.ts` exists
- `convex/tsconfig.json` exists

#### Test 4.2: Environment Variables Set
**Type**: Config Test  
**File**: `.env.local`  
**Success Criteria**:
- File exists
- `NEXT_PUBLIC_CONVEX_URL` is set
- URL format is valid (https://[deployment].convex.cloud)
- `CONVEX_DEPLOYMENT` is set

#### Test 4.3: Convex Auth Configuration
**Type**: Code Test  
**File**: `convex/auth.ts`  
**Success Criteria**:
- Google OAuth provider imported
- `convexAuth` function called correctly
- Exports `auth`, `signIn`, `signOut`, `store`, `isAuthenticated`

#### Test 4.4: Convex HTTP Routes
**Type**: Code Test  
**File**: `convex/http.ts`  
**Success Criteria**:
- `httpRouter` initialized
- Auth routes added via `auth.addHttpRoutes(http)`
- Exports http router

#### Test 4.5: Convex Provider in App
**Type**: Integration Test  
**File**: `app/ConvexClientProvider.tsx`  
**Success Criteria**:
- Component exists and is client-side ("use client")
- `ConvexReactClient` initialized with env URL
- Provider wraps children correctly
- Exports as default

---

### 5. UI/Frontend Validation (5 tests - Browser MCP)

#### Test 5.1: Home Page Loads
**Type**: Browser Test  
**URL**: `http://localhost:3000`  
**Success Criteria**:
- Page loads without errors
- Status 200
- HTML renders correctly
- No console errors (excluding warnings)
- React hydration successful

#### Test 5.2: Tailwind CSS Working
**Type**: Browser Visual Test  
**URL**: `http://localhost:3000`  
**Success Criteria**:
- Styles applied correctly
- Tailwind classes render (test with dev tools)
- No CSS errors
- Font loads correctly (Inter font)

#### Test 5.3: Convex Provider Active
**Type**: Browser Integration Test  
**Action**: Check React dev tools for Convex context
**Success Criteria**:
- ConvexProvider present in component tree
- No provider initialization errors
- Convex client connected

#### Test 5.4: Responsive Design
**Type**: Browser Responsive Test  
**Viewports**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)  
**Success Criteria**:
- Page renders at all viewport sizes
- No horizontal scroll
- Readable text at all sizes

#### Test 5.5: No Runtime Errors
**Type**: Browser Console Test  
**URL**: `http://localhost:3000`  
**Duration**: 30 seconds of page interaction  
**Success Criteria**:
- No JavaScript errors
- No unhandled promise rejections
- No network failures (404s, 500s)

---

### 6. File Structure & Configuration (4 tests)

#### Test 6.1: Required Directories Exist
**Type**: File System Test  
**Success Criteria**:
- `app/` directory exists
- `convex/` directory exists
- `public/` directory exists
- `node_modules/` directory exists

#### Test 6.2: Core Configuration Files
**Type**: File Test  
**Success Criteria**:
- `package.json` exists
- `tsconfig.json` exists
- `next.config.js` or `next.config.mjs` exists
- `convex.json` exists
- `.gitignore` exists

#### Test 6.3: App Router Structure
**Type**: Structure Test  
**Success Criteria**:
- `app/layout.tsx` exists
- `app/page.tsx` exists
- `app/globals.css` exists
- `app/ConvexClientProvider.tsx` exists
- No Pages Router remnants

#### Test 6.4: Documentation Files
**Type**: File Test  
**Success Criteria**:
- `README.md` exists and is informative
- `SETUP_STATUS.md` exists (PER-8 status)
- `PER-8_COMPLETE.md` exists (completion report)

---

## Test Execution Order

### Phase 1: Static Validation (5 min)
1. File structure tests (6.1-6.4)
2. Configuration tests (2.1, 4.1, 4.2)
3. Dependency tests (3.1-3.4)

### Phase 2: Build & Type Checking (5 min)
4. TypeScript tests (2.2, 2.3)
5. Build tests (1.1, 1.3, 1.4, 1.5)

### Phase 3: Runtime Validation (10 min)
6. Start dev server (1.2)
7. Convex integration tests (4.3-4.5)
8. Browser tests (5.1-5.5)

### Phase 4: Integration Verification (10 min)
9. End-to-end flow test
10. Performance validation
11. Documentation review

---

## Test Automation Script

```bash
#!/bin/bash
# test-per-8.sh

set -e  # Exit on error

echo "🧪 PER-8 Testing Suite"
echo "====================="

# Phase 1: Static Validation
echo ""
echo "Phase 1: Static Validation"
echo "--------------------------"

# Test 6.1-6.4: File structure
echo "✓ Checking required directories..."
test -d "app" && echo "  ✓ app/ exists"
test -d "convex" && echo "  ✓ convex/ exists"
test -d "public" && echo "  ✓ public/ exists"

echo "✓ Checking configuration files..."
test -f "package.json" && echo "  ✓ package.json exists"
test -f "tsconfig.json" && echo "  ✓ tsconfig.json exists"
test -f "convex.json" && echo "  ✓ convex.json exists"

# Test 2.1: TypeScript strict mode
echo "✓ Checking TypeScript strict mode..."
grep -q '"strict": true' tsconfig.json && echo "  ✓ Strict mode enabled"

# Test 4.1: Convex files
echo "✓ Checking Convex files..."
test -f "convex/auth.ts" && echo "  ✓ convex/auth.ts exists"
test -f "convex/http.ts" && echo "  ✓ convex/http.ts exists"

# Test 4.2: Environment
echo "✓ Checking environment variables..."
test -f ".env.local" && echo "  ✓ .env.local exists"
grep -q "NEXT_PUBLIC_CONVEX_URL" .env.local && echo "  ✓ NEXT_PUBLIC_CONVEX_URL set"

# Phase 2: Build & Type Checking
echo ""
echo "Phase 2: Build & Type Checking"
echo "------------------------------"

# Test 1.3: Type checking
echo "✓ Running TypeScript type check..."
npx tsc --noEmit && echo "  ✓ No type errors"

# Test 1.4: Linting
echo "✓ Running ESLint..."
npm run lint && echo "  ✓ No linting errors"

# Test 1.1: Production build
echo "✓ Building production bundle..."
npm run build && echo "  ✓ Build succeeded"

# Test 3.4: Security audit
echo "✓ Running security audit..."
npm audit --audit-level=high || echo "  ⚠ Known vulnerabilities (acceptable for MVP)"

echo ""
echo "✅ All automated tests passed!"
echo ""
echo "🌐 Next: Manual browser testing required"
echo "   Run: npm run dev"
echo "   Then navigate to: http://localhost:3000"
```

---

## Manual Test Checklist

After automated tests pass, perform these manual checks:

### Browser Testing (use @Browser MCP)
- [ ] Navigate to `http://localhost:3000`
- [ ] Verify page loads without errors
- [ ] Check browser console for errors
- [ ] Inspect page with dev tools (check Tailwind classes)
- [ ] Test responsive design (resize browser window)
- [ ] Verify Inter font is loaded
- [ ] Check React DevTools for Convex provider
- [ ] Test navigation (if any links exist)
- [ ] Verify no hydration errors

### Performance Testing
- [ ] Measure Time to First Byte (TTFB)
- [ ] Measure First Contentful Paint (FCP)
- [ ] Measure Largest Contentful Paint (LCP)
- [ ] Check network tab for failed requests
- [ ] Verify reasonable bundle sizes

### Documentation Review
- [ ] README.md is clear and helpful
- [ ] SETUP_STATUS.md accurately reflects status
- [ ] All setup steps are documented
- [ ] No outdated information

---

## Success Criteria Summary

All tests must pass for PER-8 to be considered complete:

### Automated Tests (21 tests)
- [ ] All build tests pass (5/5)
- [ ] All TypeScript tests pass (3/3)
- [ ] All dependency tests pass (4/4)
- [ ] All Convex tests pass (5/5)
- [ ] All file structure tests pass (4/4)

### Browser Tests (5 tests - via Browser MCP)
- [ ] Home page loads successfully
- [ ] Tailwind CSS working correctly
- [ ] Convex provider active
- [ ] Responsive design works
- [ ] No runtime errors

### Documentation
- [ ] All required documentation present
- [ ] Documentation is accurate and helpful

---

## Expected Test Duration

- **Automated tests**: 15 minutes
- **Manual browser tests**: 10 minutes
- **Documentation review**: 5 minutes
- **Total**: 30 minutes

---

## Failure Handling

If any test fails:

1. **Log the failure** with full error output
2. **Diagnose the root cause** (per CODING_RULES.md)
3. **Create a fix plan** before implementing
4. **Fix the issue**
5. **Re-run full test suite** to ensure no regressions
6. **Document the fix** in logs.md

---

## Test Output Format

Each test should output:
```
[TEST NAME]
Status: PASS/FAIL
Duration: X.XX seconds
Details: [relevant info]
Errors: [if any]
```

---

## References

- **Spec**: `/projects/2025-10-14_goodpapers_v1_mvp/spec.md`
- **PER-8 Reflection**: `/projects/2025-10-14_goodpapers_v1_mvp/2025-10-14_PER-8_reflection.md`
- **CODING_RULES**: `@CODING_RULES.md`
- **CODING_REPO_CONVENTIONS**: `@CODING_REPO_CONVENTIONS.md`

---

## Approval Required

**This test plan requires approval before execution.**

Please review and approve:
- [ ] Test coverage is comprehensive
- [ ] Success criteria are clear
- [ ] Test execution order makes sense
- [ ] Duration estimate is reasonable
- [ ] Failure handling is appropriate

**Approved by**: _____________  
**Date**: _____________

---

## Post-Testing Actions

After all tests pass:
1. Update `SETUP_STATUS.md` with "FULLY TESTED ✅"
2. Update Linear ticket PER-8 to "Done"
3. Add test results to `logs.md`
4. Create `test-results.md` with full output
5. Proceed to PER-9 and PER-10 (parallel execution)

