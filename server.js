const mongoose = require('mongoose');
const app = require('./src/app');
const logger = require('./src/utils/logger');

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clinickart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('Connected to MongoDB');
})
.catch((error) => {
  logger.error('MongoDB connection error:', error);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});