# REQUIRED Environment Variables for Render Deployment

## ⚠️ CRITICAL: Set these in your Render service BEFORE deploying

### Server Configuration
```
NODE_ENV=production
HOST=0.0.0.0
PORT=10000
```

### Database Configuration
```
DATABASE_CLIENT=postgres
DATABASE_URL=[Your PostgreSQL connection string from Render]
DATABASE_SSL=false
```

### Security Keys (REQUIRED - Generate new ones using the command below)
```
APP_KEYS=[4 comma-separated keys]
API_TOKEN_SALT=[secure random string]
ADMIN_JWT_SECRET=[secure random string]
TRANSFER_TOKEN_SALT=[secure random string]
JWT_SECRET=[secure random string] ⚠️ CRITICAL: Used for users-permissions plugin
```

### Optional but Recommended
```
STRAPI_ADMIN_BACKEND_URL=https://your-app-name.onrender.com
STRAPI_ADMIN_CLIENT_URL=https://your-app-name.onrender.com
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=[secure random string]
```

## 🔑 Generate Secure Keys

Run this command in your terminal to generate all required keys:

```bash
node generate-keys.js
```

Then copy each key to the corresponding environment variable in your Render service settings.

## 🚀 Deployment Steps

1. **Set ALL environment variables above in Render**
2. **Commit and push your changes**
3. **Trigger a new deployment**

## ❌ Previous Errors Analysis

### Error 1: Missing admin.auth.secret
```
Missing admin.auth.secret configuration. The SessionManager requires a JWT secret
```
✅ **Fixed by**: Adding `admin.auth.secret` configuration in server.ts

### Error 2: Missing jwtSecret for users-permissions
```
Missing jwtSecret. Please, set configuration variable "jwtSecret" for the users-permissions plugin
```
✅ **Fixed by**: Adding users-permissions configuration in plugins.ts

Both errors have been resolved by:
- Configuring the admin authentication secret
- Configuring the users-permissions plugin JWT secret
- Ensuring JWT_SECRET environment variable is properly set

**CRITICAL**: Make sure to set the JWT_SECRET environment variable in your Render service - it's used by both configurations!