# Intentified Deployment Guide

This document provides detailed instructions for deploying the Intentified platform to production environments. Follow these steps to ensure a proper setup and configuration.

## Prerequisites

Before deployment, ensure you have:

- Node.js 18.x or higher installed
- Access to a Supabase account for database services
- Access to a Clerk account for authentication services
- A Vercel account (recommended) or another Next.js-compatible hosting platform
- Git for version control

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-organization/intentified.git
cd intentified
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_***
CLERK_SECRET_KEY=sk_***
CLERK_JWT_KEY=jwt_***

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ***
SUPABASE_SERVICE_ROLE_KEY=eyJ***

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### 3. Database Initialization

1. Create a new Supabase project
2. Run the database initialization script:

```bash
npm run setup:db
```

This will create the necessary tables and initial data structures in your Supabase database.

## Local Development Build

To build and test locally before deployment:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server locally
npm run start
```

Visit `http://localhost:3000` to verify the build works correctly.

## Deployment to Vercel (Recommended)

### 1. Connect Repository to Vercel

1. Login to your Vercel account
2. Click "New Project"
3. Import your GitHub repository
4. Configure the build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: Leave as default

### 2. Configure Environment Variables

Add all environment variables from your `.env.local` file to the Vercel project settings.

### 3. Deploy

Click "Deploy" and wait for the build process to complete.

### 4. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain and follow the DNS configuration instructions

## Alternative Deployments

### Self-Hosted Server

#### 1. Build the Application

```bash
npm install
npm run build
```

#### 2. Start the Production Server

```bash
npm run start
```

Consider using a process manager like PM2:

```bash
npm install -g pm2
pm2 start npm --name "intentified" -- start
```

#### 3. Reverse Proxy Configuration (Nginx Example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Deployment

A Dockerfile is included for containerized deployment.

#### 1. Build the Docker Image

```bash
docker build -t intentified:latest .
```

#### 2. Run the Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_*** \
  -e CLERK_SECRET_KEY=sk_*** \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ*** \
  -e SUPABASE_SERVICE_ROLE_KEY=eyJ*** \
  -e NEXT_PUBLIC_APP_URL=https://your-domain.com \
  -e NODE_ENV=production \
  intentified:latest
```

## Post-Deployment Configuration

### 1. Set Up User Roles in Clerk

1. Go to your Clerk Dashboard
2. Navigate to the Users section
3. Select the user(s) you want to make administrators
4. Add the following metadata to these users:
   ```json
   {
     "role": "admin"
   }
   ```

### 2. Initial Data Setup

The first admin user should:

1. Log in to the application
2. Navigate to Settings > General
3. Complete the initial setup process
4. Import any initial customer data if available

### 3. Configure Integrations (Optional)

In the dashboard, navigate to Settings > Integrations to configure any third-party connections.

## Monitoring and Maintenance

### Performance Monitoring

Consider setting up application monitoring:

- Vercel Analytics (if using Vercel)
- Sentry for error tracking
- New Relic or Datadog for performance monitoring

### Database Maintenance

- Regular backups of your Supabase database
- Performance monitoring for database queries
- Consider setting up a read replica for high-traffic deployments

### Security Updates

- Regularly update dependencies with `npm audit fix`
- Keep Next.js and React updated to the latest stable versions
- Monitor Clerk and Supabase for security announcements

## Troubleshooting

### Common Issues

1. **Authentication Problems**
   - Verify Clerk environment variables are correctly set
   - Check CORS settings if using a custom domain

2. **Database Connection Issues**
   - Confirm Supabase URL and API keys are correct
   - Check if IP restrictions are properly configured

3. **Build Failures**
   - Check for TypeScript errors in the codebase
   - Verify Node.js version is compatible

### Support

For deployment assistance, contact:
- support@intentified.com
- [GitHub Issues](https://github.com/your-organization/intentified/issues)

## Scaling Considerations

### Horizontal Scaling

The application is designed to scale horizontally. For high-traffic deployments:

1. Use a CDN for static assets
2. Consider multiple server instances behind a load balancer
3. Implement caching strategies for API responses

### Database Scaling

As your data grows:

1. Consider Supabase's higher tier plans
2. Implement query optimization for high-traffic tables
3. Use connection pooling for efficient database connections

## Backup and Disaster Recovery

1. Set up automated database backups in Supabase
2. Implement a regular export of critical data
3. Document a disaster recovery plan with step-by-step restoration procedures

---

For additional deployment assistance or custom configurations, please contact our support team.