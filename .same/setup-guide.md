# Configuration Setup Guide - DSN Platform

## 🚀 Quick Start

The DSN platform requires configuration of three main services: Clerk (authentication), Supabase (database), and Cloudinary (file storage).

## 📋 Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Supabase Database (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Cloudinary File Storage (Required)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🔐 1. Clerk Authentication Setup

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application for "Master DSN Platform"
3. In your Clerk dashboard:
   - Copy the **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy the **Secret key** → `CLERK_SECRET_KEY`
4. Configure sign-in/sign-up options (email + password recommended)

## 🗄️ 2. Supabase Database Setup

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project named "DSN Master Platform"
3. Wait for project initialization (2-3 minutes)
4. In your project dashboard:
   - Go to **Settings** → **API**
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Go to **SQL Editor** and run the schema from `.same/database-schema.sql`

## ☁️ 3. Cloudinary File Storage Setup

1. Go to [cloudinary.com](https://cloudinary.com) and create an account
2. In your dashboard:
   - Copy **Cloud name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - Copy **API Key** → `NEXT_PUBLIC_CLOUDINARY_API_KEY`
   - Copy **API Secret** → `CLOUDINARY_API_SECRET`
3. Configure upload settings:
   - Go to **Settings** → **Upload**
   - Create upload preset named `dsn-academic-docs`
   - Set folder to `dsn-works`
   - Allow formats: PDF, DOC, DOCX, PPT, PPTX
   - Set max file size to 10MB

## 🧪 Testing Your Setup

After configuration, test each service:

1. **Authentication**: Try signing up/in
2. **Database**: Check if modules load in deposit form
3. **File Storage**: Try uploading a document

## 🚨 Troubleshooting

### Common Issues:

- **Clerk not working**: Check publishable key format (starts with `pk_`)
- **Database errors**: Verify Supabase URL and run the SQL schema
- **File upload fails**: Check Cloudinary API keys and upload preset
- **Development server issues**: Restart with `bun run dev`

### Environment Variable Validation:

Run this command to check your setup:
```bash
bun run dev
```

The console will show which environment variables are missing.

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use different credentials for development and production
- Enable Row Level Security in Supabase (already configured in schema)
- Configure CORS settings in Cloudinary for your domain

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure database schema is applied in Supabase
4. Test individual services in their respective dashboards
