# Deployment Guide - Mobile Print API

## Playwright Browser Installation

The mobile print API requires Playwright browsers to be installed in the production environment.

### Automatic Installation

The `postinstall` script in `package.json` automatically installs Playwright browsers after `npm install`:

```json
"postinstall": "npx playwright install --with-deps chromium || true"
```

### Manual Installation

If automatic installation fails, run manually:

```bash
npx playwright install chromium
```

Or install with system dependencies:

```bash
npx playwright install --with-deps chromium
```

### Platform-Specific Notes

#### Vercel / Serverless

**✅ Configured for Vercel**: The `postinstall` script automatically installs Playwright browsers during Vercel's build process.

**Configuration:**
- `postinstall` script runs after `npm install` → installs Playwright browsers
- `build` script includes browser installation as backup
- `vercel.json` configured with 60s timeout for the print API route

**Vercel Build Process:**
1. Vercel runs `npm install` → triggers `postinstall` → installs Playwright browsers
2. Vercel runs `npm run build` → includes browser installation as backup
3. Browsers are cached in `/home/sbx_user1051/.cache/ms-playwright/` (Vercel's cache)

**If browsers still don't install:**
- Check Vercel build logs for Playwright installation errors
- Ensure build has sufficient disk space (Playwright needs ~170MB)
- Consider using Vercel's Edge Functions or a separate rendering service for very high traffic

#### Docker

Add to your Dockerfile:

```dockerfile
# Install Playwright browsers
RUN npx playwright install --with-deps chromium
```

#### Traditional Server

Ensure the postinstall script runs:

```bash
npm install
# This automatically runs: npx playwright install --with-deps chromium
```

### Environment Variables

No special environment variables needed. Playwright will use the default cache location:
- Linux: `~/.cache/ms-playwright/`
- macOS: `~/Library/Caches/ms-playwright/`
- Windows: `%LOCALAPPDATA%\ms-playwright\`

### Troubleshooting

#### Error: "Executable doesn't exist"

**Solution**: Run `npx playwright install chromium` in the production environment.

#### Error: "Permission denied"

**Solution**: Ensure the deployment user has write access to the Playwright cache directory.

#### Error: "Out of memory"

**Solution**: Playwright requires sufficient memory. Consider:
- Increasing server memory
- Using a dedicated rendering service
- Implementing request queuing

### Alternative: Use Playwright Docker Image

For consistent deployments, use Playwright's official Docker image:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# Your app setup
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "start"]
```

### Verification

Test the installation:

```bash
npx playwright install chromium
npx playwright --version
```

The API will automatically use the installed browsers when rendering labels.

