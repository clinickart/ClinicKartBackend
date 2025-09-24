module.exports = {
  // Email Service Configuration
  EMAIL_SERVICE: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },
  
  // Email Defaults
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@clinickart.com',
  
  // Email Templates
  TEMPLATES: {
    OTP: 'otp',
    WELCOME: 'welcome',
    PASSWORD_RESET: 'password-reset',
    ORDER_CONFIRMATION: 'order-confirmation'
  }
};