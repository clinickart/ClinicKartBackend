# ClinicKart Backend API

A comprehensive Node.js backend API for ClinicKart platform following domain-driven design with complete vendor, user, and admin modules.

## 🚀 Features

- **Modular Architecture**: Domain-driven design with clean separation of concerns
- **Complete Vendor Module**: Registration, authentication, profile management with JWT & OTP
- **User Management**: Comprehensive user system with wishlist, wallet, and KYC
- **Admin Panel**: Admin operations and management
- **Product Catalog**: Complete product management system
- **Order Management**: End-to-end order processing
- **Payment Integration**: Multiple payment gateway support (Razorpay, Stripe, PayPal)
- **Delivery Tracking**: Real-time delivery management
- **Content Management**: Blog and banner management
- **Review System**: Product reviews and ratings
- **Notification System**: Email, SMS, and push notifications
- **Security**: JWT authentication, rate limiting, input validation
- **API Documentation**: OpenAPI/Swagger documentation

## 📁 Project Structure

```
clinicKart-backend/
│
├── package.json
├── .env
├── .gitignore
├── server.js                   # Server entry point
│
├── src/
│   ├── app.js                  # Express app setup
│   │
│   ├── config/                 # Global configurations
│   │   ├── db.js              # Database connection
│   │   ├── jwt.js             # JWT configuration
│   │   ├── mail.js            # Email service config
│   │   ├── payment.js         # Payment gateway config
│   │   └── cloud.js           # Cloud storage config
│   │
│   ├── middlewares/           # Global middlewares
│   │   ├── auth.middleware.js # JWT auth + Role based access
│   │   ├── error.middleware.js# Centralized error handler
│   │   └── validate.middleware.js # Schema validation wrapper
│   │
│   ├── utils/                 # Shared utilities
│   │   ├── otp.js            # OTP generator/validator
│   │   ├── emailSender.js    # Email helper
│   │   ├── smsSender.js      # SMS helper
│   │   ├── logger.js         # Winston logger
│   │   └── response.js       # Standard API response format
│   │
│   ├── modules/              # Domain-driven modules
│   │   │
│   │   ├── auth/             # Authentication module
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── user/             # User domain
│   │   │   ├── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.routes.js
│   │   │   └── user.validation.js
│   │   │
│   │   ├── vendor/           # Vendor domain (COMPLETE)
│   │   │   ├── vendor.model.js
│   │   │   ├── vendor.controller.js
│   │   │   ├── vendor.service.js
│   │   │   ├── vendor.routes.js
│   │   │   └── vendor.validation.js
│   │   │
│   │   ├── admin/            # Admin domain
│   │   ├── product/          # Product catalog
│   │   ├── order/            # Order management
│   │   ├── payment/          # Payment processing
│   │   ├── delivery/         # Delivery & tracking
│   │   ├── blog/             # Content management
│   │   ├── banner/           # Promotions & banners
│   │   ├── notification/     # Notification system
│   │   └── review/           # Reviews & ratings
│   │
│   ├── routes/               # Central route registry
│   │   └── index.js
│   │
│   └── docs/                 # API documentation
│       └── openapi.yaml
│
└── tests/                    # Test suites
    ├── auth.test.js
    ├── user.test.js
    ├── vendor.test.js
    └── product.test.js
```

## 🛠️ Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **Email**: Nodemailer
- **SMS**: Twilio/MSG91
- **Validation**: Express-validator
- **File Upload**: Multer with Cloudinary/AWS S3
- **Payment**: Razorpay, Stripe, PayPal
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Documentation**: OpenAPI/Swagger

## 📋 Prerequisites

- Node.js 20 or higher
- MongoDB
- Email service (Gmail, SendGrid, etc.)
- Payment gateway accounts (optional)
- Cloud storage account (Cloudinary/AWS S3)

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd clinickart-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Environment Variables:**
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/clinickart

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@clinickart.com

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

## 📡 API Endpoints

### **Authentication**
- `POST /api/v1/auth/login` - Universal login
- `POST /api/v1/auth/register` - Universal registration
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password

### **Vendor Module (COMPLETE)**
- `POST /api/v1/vendors/register` - Register vendor
- `POST /api/v1/vendors/login` - Vendor login
- `POST /api/v1/vendors/logout` - Vendor logout
- `POST /api/v1/vendors/verify-email` - Verify email OTP
- `POST /api/v1/vendors/resend-email-otp` - Resend email OTP
- `GET /api/v1/vendors/profile` - Get vendor profile
- `PUT /api/v1/vendors/profile` - Update vendor profile

### **User Management**
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/wishlist` - Get user wishlist

### **Product Catalog**
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `GET /api/v1/products/category/:categoryId` - Get products by category
- `GET /api/v1/products/vendor/:vendorId` - Get products by vendor

### **Order Management**
- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id/status` - Update order status
- `POST /api/v1/orders/:id/cancel` - Cancel order

### **Payment Processing**
- `POST /api/v1/payments/create-order` - Create payment order
- `POST /api/v1/payments/verify` - Verify payment
- `POST /api/v1/payments/webhook` - Payment webhook
- `POST /api/v1/payments/refund` - Refund payment

### **Admin Operations**
- `GET /api/v1/admin/dashboard` - Admin dashboard
- `GET /api/v1/admin/users` - Manage users
- `GET /api/v1/admin/vendors` - Manage vendors
- `GET /api/v1/admin/orders` - Manage orders

## 🔑 Authentication

JWT-based authentication with role-based access control:

```bash
Authorization: Bearer <your_jwt_token>
```

**Roles**: `user`, `vendor`, `admin`

## 📝 API Examples

### **Register Vendor**
```bash
POST /api/v1/vendors/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@pharmacy.com",
  "phone": "+1234567890",
  "password": "SecurePass123",
  "businessName": "ABC Pharmacy",
  "businessType": "pharmacy",
  "businessRegistrationNumber": "REG123456",
  "gstNumber": "22AAAAA0000A1Z5",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra", 
    "pincode": "400001"
  }
```

### **Vendor Login**
```bash
POST /api/v1/vendors/login
Content-Type: application/json

{
  "email": "john@pharmacy.com",
  "password": "SecurePass123"
}
```

### **Create Product**
```bash
POST /api/v1/products
Authorization: Bearer <vendor_token>
Content-Type: application/json

{
  "name": "Paracetamol 500mg",
  "description": "Pain relief medication",
  "price": 50,
  "discountPrice": 45,
  "category": "64f5b8c8a1b2c3d4e5f6g7h8",
  "sku": "PARA500-001",
  "stock": 100,
  "brand": "HealthCare"
}
```

## 📊 Response Format

### **Success Response**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Error Response**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Paginated Response**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Access & refresh tokens
- **Rate Limiting**: Request throttling
- **Input Validation**: Express-validator
- **SQL Injection Protection**: Mongoose sanitization
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **OTP Verification**: Email/SMS verification

## 🗃️ Database Models

### **User Model**
- Personal information (name, email, phone)
- Location data with GeoJSON
- Wallet and financial data
- KYC verification status
- Wishlist and preferences

### **Vendor Model**
- Business information and registration
- Address and service areas
- Email/phone verification
- Product categories
- Ratings and reviews

### **Product Model**
- Product details and specifications
- Pricing and discounts
- Inventory management
- Images and media
- SEO and search optimization

### **Order Model**
- Order items and quantities
- Pricing calculations
- Status tracking
- Payment information
- Delivery details

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.js
```

## 📝 API Documentation

API documentation is available at:
- **Development**: `http://localhost:5000/api/docs`
- **OpenAPI Spec**: `/src/docs/openapi.yaml`

## 🚀 Deployment

### **Docker**
```bash
# Build image
docker build -t clinickart-backend .

# Run container
docker run -p 5000:5000 --env-file .env clinickart-backend
```

### **PM2**
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit
```

## 📈 Development Guidelines

### **Adding New Module**
1. Create module directory in `/src/modules/`
2. Add model, controller, service, routes, validation files
3. Register routes in `/src/routes/index.js`
4. Add tests in `/tests/`
5. Update API documentation

### **Code Standards**
- Follow ESLint configuration
- Use Prettier for code formatting
- Write unit tests for services
- Add JSDoc comments
- Follow REST API conventions

## � Development Status

- ✅ **Vendor Module**: Complete (Registration, Auth, Profile, OTP)
- 🔄 **User Module**: Model ready, endpoints pending
- 🔄 **Admin Module**: Basic structure, features pending
- 🔄 **Product Module**: Model ready, CRUD pending
- 🔄 **Order Module**: Model ready, processing pending
- 🔄 **Payment Module**: Structure ready, integration pending
- 🔄 **Other Modules**: Placeholder structure created

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@clinickart.com
- **Documentation**: [API Docs](http://localhost:5000/api/docs)
- **Issues**: [GitHub Issues](https://github.com/clinickart/backend/issues)

---

**Built with ❤️ for ClinicKart Platform**