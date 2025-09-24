module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret_here',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // JWT Options
  JWT_OPTIONS: {
    issuer: 'clinickart-api',
    audience: 'clinickart-users'
  },
  
  // Refresh Token Options
  REFRESH_TOKEN_OPTIONS: {
    issuer: 'clinickart-api',
    audience: 'clinickart-users'
  }
};