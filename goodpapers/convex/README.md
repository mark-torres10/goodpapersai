# Convex Setup Instructions

## Initial Setup Required

The Convex CLI requires interactive setup. Please run these commands:

### 1. Initialize Convex Project
```bash
cd /Users/mark/Documents/work/goodpapers/goodpapers
npx convex dev --configure=new
```

This will:
- Prompt you to login/create Convex account
- Create a new Convex project
- Generate `.env.local` with `NEXT_PUBLIC_CONVEX_URL`
- Create `convex/_generated/` folder with TypeScript types

### 2. Set up Convex Auth
```bash
npx @convex-dev/auth
```

This will:
- Create `convex/auth.ts` configuration
- Set up authentication infrastructure
- Provide instructions for OAuth providers

### 3. Configure Google OAuth

After Convex setup, configure Google OAuth:

**In Google Cloud Console:**
1. Go to https://console.cloud.google.com
2. Create new project: "Goodpapers"
3. **No APIs need to be enabled** (Google+ was deprecated in 2019, OAuth works without it)
4. Create OAuth 2.0 Client ID (APIs & Services → Credentials):
   - Type: Web application
   - Name: "Goodpapers"
   - Authorized redirect URI: `https://[your-deployment].convex.site/api/auth/callback/google`
     (Get exact URL from Convex dashboard)
5. Copy Client ID and Secret

**Set in Convex:**
```bash
npx convex env set AUTH_GOOGLE_ID <your_client_id>
npx convex env set AUTH_GOOGLE_SECRET <your_client_secret>
```

### 4. Verify Setup
```bash
npx convex dev  # Should connect and watch files
npm run build   # Should pass with no errors
```

## After Setup

Once Convex is configured, you can proceed with PER-9 (Backend Schema) and PER-10 (ArXiv Integration) in parallel.

