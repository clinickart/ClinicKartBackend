const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');
const logger = require('./logger');

class EmailSender {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Try to create transporter with provided config
      this.transporter = nodemailer.createTransport(mailConfig.EMAIL_SERVICE);
      
      // Test the connection
      await this.transporter.verify();
      logger.info('📧 Email service connected successfully');
      
    } catch (error) {
      logger.warn('⚠️ Email service not configured - will skip email sending');
      this.transporter = null;
    }
  }

  /**
   * Send email
   * @param {object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text content
   * @param {string} options.html - HTML content
   */
  async sendEmail(options) {
    try {
      // Ensure transporter is initialized
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      if (!this.transporter) {
        // TODO: Remove this once email setup is done - just log for now
        logger.info(`📧 EMAIL WOULD BE SENT TO: ${options.to} - Subject: ${options.subject}`);
        return { messageId: 'test-message-id' };
      }

      const message = {
        from: mailConfig.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const info = await this.transporter.sendMail(message);
      logger.info(`📧 Email sent: ${info.messageId}`);
      
      return info;
    } catch (error) {
      logger.error('Email sending error:', error);
      throw error;
    }
  }

  /**
   * Send OTP email
   * @param {string} email - Recipient email
   * @param {string} otp - OTP code
   * @param {string} purpose - OTP purpose (registration, login, reset)
   */
  async sendOTPEmail(email, otp, purpose = 'verification') {
    const subject = `ClinicKart - Your ${purpose.toUpperCase()} OTP`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">ClinicKart Verification</h2>
        <p>Your OTP for ${purpose} is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This is an automated message from ClinicKart.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Your ClinicKart ${purpose} OTP is: ${otp}. This OTP will expire in 10 minutes.`
    });
  }

  /**
   * Send welcome email
   * @param {string} email - Recipient email
   * @param {string} name - User name
   * @param {string} userType - User type (vendor, user, admin)
   */
  async sendWelcomeEmail(email, name, userType = 'user') {
    const subject = 'Welcome to ClinicKart!';
    const dashboardUrl = `${process.env.FRONTEND_URL}/${userType}/dashboard`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ClinicKart, ${name}!</h2>
        <p>Thank you for joining our platform. We're excited to have you as a ${userType}.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${dashboardUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Go to Dashboard
          </a>
        </div>
        <p>If you have any questions, feel free to contact our support team.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Best regards,<br>The ClinicKart Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Welcome to ClinicKart, ${name}! Thank you for joining our platform.`
    });
  }

  /**
   * Send password reset email
   * @param {string} email - Recipient email
   * @param {string} resetToken - Password reset token
   */
  async sendPasswordResetEmail(email, resetToken) {
    const subject = 'ClinicKart - Password Reset Request';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Best regards,<br>The ClinicKart Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Reset your password: ${resetUrl}`
    });
  }

  /**
   * Send order confirmation email
   * @param {string} email - Customer email
   * @param {object} orderDetails - Order details
   */
  async sendOrderConfirmationEmail(email, orderDetails) {
    const subject = `Order Confirmation - ${orderDetails.orderId}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Thank you for your order! Here are the details:</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
          <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleDateString()}</p>
        </div>
        <p>We'll send you another email when your order is shipped.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Best regards,<br>The ClinicKart Team</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text: `Order confirmation for ${orderDetails.orderId}. Total: ₹${orderDetails.totalAmount}`
    });
  }
}

module.exports = new EmailSender();