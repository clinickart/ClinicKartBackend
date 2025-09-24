module.exports = {
  // Cloudinary Configuration
  CLOUDINARY: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    folder: {
      users: 'clinickart/users',
      vendors: 'clinickart/vendors',
      products: 'clinickart/products',
      banners: 'clinickart/banners',
      blogs: 'clinickart/blogs'
    }
  },
  
  // AWS S3 Configuration
  AWS_S3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.AWS_S3_BUCKET,
    folders: {
      users: 'users/',
      vendors: 'vendors/',
      products: 'products/',
      banners: 'banners/',
      blogs: 'blogs/'
    }
  },
  
  // Default Cloud Storage Provider
  DEFAULT_PROVIDER: process.env.CLOUD_STORAGE_PROVIDER || 'cloudinary',
  
  // File Upload Limits
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};