# Deploying Strapi to Render

This guide will help you deploy your Strapi application to Render.

## Prerequisites

1. A Render account (https://render.com)
2. Your Strapi project pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Create a PostgreSQL Database

1. Go to your Render dashboard
2. Click "New" → "PostgreSQL"
3. Choose a name for your database (e.g., `my-strapi-db`)
4. Select a region close to your users
5. Choose a plan (Free tier available for testing)
6. Click "Create Database"
7. Once created, note down the connection details

### 2. Deploy the Web Service

1. Go to your Render dashboard
2. Click "New" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `my-strapi` (or your preferred name)
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Runtime**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`

### 3. Set Environment Variables

In your Render web service settings, add these environment variables:

#### Required Variables
```
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=[Your PostgreSQL connection string from step 1]
HOST=0.0.0.0
PORT=10000
```

#### Security Keys (Generate new secure values)
Use this Node.js command to generate secure keys:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

```
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=[generated secure string]
ADMIN_JWT_SECRET=[generated secure string]
TRANSFER_TOKEN_SALT=[generated secure string]
JWT_SECRET=[generated secure string]
```

#### Optional Variables
```
STRAPI_ADMIN_BACKEND_URL=https://your-app-name.onrender.com
STRAPI_ADMIN_CLIENT_URL=https://your-app-name.onrender.com
DATABASE_SSL=false
```

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. The first deployment may take 5-10 minutes

### 5. Access Your Application

Once deployed:
- Your API will be available at: `https://your-app-name.onrender.com`
- Admin panel will be at: `https://your-app-name.onrender.com/admin`

## Important Notes

### File Uploads
Render's filesystem is ephemeral. For file uploads, consider:
- Using Cloudinary plugin
- AWS S3 integration
- Other cloud storage providers

### Database Migrations
On first deployment, Strapi will automatically create the database schema.

### Performance
- Free tier services sleep after inactivity
- Consider upgrading to a paid plan for production use

### Troubleshooting

If deployment fails, check:
1. All environment variables are set correctly
2. Database connection string is valid
3. Build logs in Render dashboard for specific errors

## Security Considerations

1. **Never commit sensitive environment variables** to your repository
2. **Generate strong, unique keys** for all security-related environment variables
3. **Use HTTPS only** in production
4. **Regularly update dependencies** for security patches

## Maintenance

- Monitor your application through Render's dashboard
- Set up log monitoring for production issues
- Regular backups of your PostgreSQL database
- Keep Strapi and dependencies updated