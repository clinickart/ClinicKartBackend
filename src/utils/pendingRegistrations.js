/**
 * Temporary storage for pending registrations
 * In production, use Redis or a temporary database table
 */
class PendingRegistrations {
  constructor() {
    this.registrations = new Map();
    this.otps = new Map();
    
    // Clean up expired registrations every 30 minutes
    setInterval(() => {
      this.cleanupExpired();
    }, 30 * 60 * 1000);
  }

  /**
   * Store pending registration data temporarily
   */
  storePendingRegistration(email, registrationData) {
    const key = email.toLowerCase();
    const data = {
      ...registrationData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    };
    
    this.registrations.set(key, data);
    console.log(`📝 Stored pending registration for: ${email}`);
    return key;
  }

  /**
   * Store OTP for email verification
   */
  storeOTP(email, otp) {
    const key = email.toLowerCase();
    const otpData = {
      otp,
      attempts: 0,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    
    this.otps.set(key, otpData);
    console.log(`🔐 Stored OTP for: ${email}`);
    return otp;
  }

  /**
   * Get pending registration data
   */
  getPendingRegistration(email) {
    const key = email.toLowerCase();
    const data = this.registrations.get(key);
    
    if (!data) return null;
    
    // Check if expired
    if (data.expiresAt < new Date()) {
      this.registrations.delete(key);
      this.otps.delete(key);
      return null;
    }
    
    return data;
  }

  /**
   * Check if OTP was sent recently (within cooldown period)
   */
  canResendOTP(email, cooldownMinutes = 2) {
    const key = email.toLowerCase();
    const otpData = this.otps.get(key);
    
    if (!otpData) return true; // No OTP exists, can send
    
    const timeSinceLastOTP = new Date() - otpData.createdAt;
    const cooldownMs = cooldownMinutes * 60 * 1000;
    
    return timeSinceLastOTP >= cooldownMs;
  }

  /**
   * Get time remaining for OTP resend
   */
  getResendCooldownTime(email, cooldownMinutes = 2) {
    const key = email.toLowerCase();
    const otpData = this.otps.get(key);
    
    if (!otpData) return 0;
    
    const timeSinceLastOTP = new Date() - otpData.createdAt;
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const remainingMs = cooldownMs - timeSinceLastOTP;
    
    return Math.max(0, Math.ceil(remainingMs / 1000)); // Return seconds
  }

  /**
   * Get OTP data
   */
  getOTP(email) {
    const key = email.toLowerCase();
    const otpData = this.otps.get(key);
    
    if (!otpData) return null;
    
    // Check if expired
    if (otpData.expiresAt < new Date()) {
      this.otps.delete(key);
      return null;
    }
    
    return otpData;
  }

  /**
   * Verify OTP and get registration data
   */
  verifyOTP(email, providedOTP) {
    const key = email.toLowerCase();
    const otpData = this.getOTP(key);
    const registrationData = this.getPendingRegistration(key);
    
    if (!otpData || !registrationData) {
      return { success: false, error: 'OTP expired or registration not found' };
    }

    // Check attempts
    if (otpData.attempts >= 5) {
      return { success: false, error: 'Too many OTP attempts' };
    }

    // Verify OTP
    if (otpData.otp !== providedOTP) {
      otpData.attempts += 1;
      return { success: false, error: 'Invalid OTP' };
    }

    // OTP verified successfully
    const data = registrationData;
    
    // Clean up temporary data
    this.registrations.delete(key);
    this.otps.delete(key);
    
    return { success: true, registrationData: data };
  }

  /**
   * Clean up expired registrations
   */
  cleanupExpired() {
    const now = new Date();
    
    for (const [key, data] of this.registrations.entries()) {
      if (data.expiresAt < now) {
        this.registrations.delete(key);
        console.log(`🧹 Cleaned up expired registration: ${key}`);
      }
    }
    
    for (const [key, data] of this.otps.entries()) {
      if (data.expiresAt < now) {
        this.otps.delete(key);
        console.log(`🧹 Cleaned up expired OTP: ${key}`);
      }
    }
  }

  /**
   * Get registration statistics
   */
  getStats() {
    return {
      pendingRegistrations: this.registrations.size,
      pendingOTPs: this.otps.size
    };
  }
}

// Singleton instance
const pendingRegistrations = new PendingRegistrations();

module.exports = pendingRegistrations;