const logger = require('./logger');

// SMS Service Configuration (using a popular SMS service like Twilio)
const smsConfig = {
  TWILIO: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  MSG91: {
    authKey: process.env.MSG91_AUTH_KEY,
    templateId: process.env.MSG91_TEMPLATE_ID,
    senderId: process.env.MSG91_SENDER_ID
  }
};

class SMSSender {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'twilio';
    this.initializeProvider();
  }

  initializeProvider() {
    if (this.provider === 'twilio') {
      try {
        this.client = require('twilio')(
          smsConfig.TWILIO.accountSid,
          smsConfig.TWILIO.authToken
        );
      } catch (error) {
        logger.warn('Twilio not configured properly. SMS functionality disabled.');
      }
    }
    // Add other SMS providers as needed
  }

  /**
   * Send SMS
   * @param {string} to - Phone number
   * @param {string} message - SMS message
   */
  async sendSMS(to, message) {
    try {
      if (!this.client) {
        throw new Error('SMS provider not configured');
      }

      let result;

      switch (this.provider) {
        case 'twilio':
          result = await this.sendTwilioSMS(to, message);
          break;
        case 'msg91':
          result = await this.sendMsg91SMS(to, message);
          break;
        default:
          throw new Error(`Unsupported SMS provider: ${this.provider}`);
      }

      logger.info(`SMS sent successfully to ${to}`);
      return result;
    } catch (error) {
      logger.error('SMS sending error:', error);
      throw error;
    }
  }

  /**
   * Send SMS via Twilio
   * @param {string} to - Phone number
   * @param {string} message - SMS message
   */
  async sendTwilioSMS(to, message) {
    return await this.client.messages.create({
      body: message,
      from: smsConfig.TWILIO.phoneNumber,
      to: to
    });
  }

  /**
   * Send SMS via MSG91
   * @param {string} to - Phone number  
   * @param {string} message - SMS message
   */
  async sendMsg91SMS(to, message) {
    // Implement MSG91 SMS sending logic
    // This would typically involve making HTTP requests to MSG91 API
    const response = await fetch('https://api.msg91.com/api/sendhttp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        authkey: smsConfig.MSG91.authKey,
        mobiles: to,
        message: message,
        sender: smsConfig.MSG91.senderId,
        route: '4'
      })
    });

    return await response.text();
  }

  /**
   * Send OTP SMS
   * @param {string} phone - Phone number
   * @param {string} otp - OTP code
   * @param {string} purpose - OTP purpose
   */
  async sendOTPSMS(phone, otp, purpose = 'verification') {
    const message = `Your ClinicKart ${purpose} OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.`;
    return this.sendSMS(phone, message);
  }

  /**
   * Send order update SMS
   * @param {string} phone - Phone number
   * @param {object} orderDetails - Order details
   */
  async sendOrderUpdateSMS(phone, orderDetails) {
    const message = `Your order ${orderDetails.orderId} has been ${orderDetails.status}. Track: ${process.env.FRONTEND_URL}/track/${orderDetails.orderId}`;
    return this.sendSMS(phone, message);
  }

  /**
   * Send promotional SMS
   * @param {string} phone - Phone number
   * @param {string} offer - Promotional offer
   */
  async sendPromotionalSMS(phone, offer) {
    const message = `🎉 Special offer from ClinicKart: ${offer}. Shop now: ${process.env.FRONTEND_URL}`;
    return this.sendSMS(phone, message);
  }
}

module.exports = new SMSSender();