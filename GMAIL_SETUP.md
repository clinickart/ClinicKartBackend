# 📧 Gmail Setup Guide for ClinicKart Backend

## Quick Gmail Configuration Steps:

### 1. Enable 2-Factor Authentication
- Go to: https://myaccount.google.com/security
- Click "2-Step Verification" and follow the setup

### 2. Generate App Password
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" from dropdown
- Click "Generate"
- Copy the 16-character password (example: abcd efgh ijkl mnop)

### 3. Update .env file
Replace these lines in your .env file:
```
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASS=your_16_character_app_password
```

### Example:
```
EMAIL_USER=johndoe@gmail.com  
EMAIL_PASS=abcd efgh ijkl mnop
```

### 4. Restart Server
After updating .env, restart your server:
```
npm start
```

## 🎯 Alternative: Use Ethereal (No Setup Required)

The system is now configured to automatically use Ethereal Email if Gmail credentials are not provided.

Ethereal Email:
- ✅ No signup required
- ✅ Automatically creates test accounts
- ✅ View emails at: https://ethereal.email/messages
- ✅ Perfect for development testing

## Test It!
1. Start your server
2. Test vendor registration in Postman
3. Check console for email preview URLs