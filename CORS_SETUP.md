# CORS Configuration for API Integration

## Problem
The frontend application was getting CORS errors when trying to access the API at `https://localhost:7249/api` due to cross-origin restrictions.

## Solution
We've implemented a Vite proxy to handle CORS issues during development.

### Configuration Files Updated:

#### 1. `vite.config.ts`
- Added proxy configuration to forward `/api` requests to `https://localhost:7249`
- Disabled SSL verification for development (`secure: false`)
- Added logging for debugging proxy requests

#### 2. `.env`
- Changed `VITE_API_BASE_URL` from `https://localhost:7249/api` to `/api`
- This makes the frontend use the proxy instead of direct API calls

#### 3. `src/services/api.js`
- Updated fallback URL to use `/api` instead of full URL
- Added proper headers for CORS handling

### How It Works:
1. Frontend makes request to `/api/Units`
2. Vite proxy intercepts the request
3. Proxy forwards to `https://localhost:7249/api/Units`
4. Response is sent back through the proxy to frontend
5. No CORS issues because the request appears to come from the same origin

### For Production:
In production, you'll need to configure your web server (nginx, Apache, etc.) or your backend API to handle CORS properly by setting appropriate headers:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

### Restart Required:
After making these changes, restart your development server:
```bash
npm run dev
```