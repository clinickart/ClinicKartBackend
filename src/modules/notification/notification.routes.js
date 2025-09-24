const express = require('express');
const router = express.Router();

// Notification routes - To be implemented
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get notifications endpoint - To be implemented' });
});

router.post('/send', (req, res) => {
  res.json({ success: true, message: 'Send notification endpoint - To be implemented' });
});

router.put('/:id/read', (req, res) => {
  res.json({ success: true, message: 'Mark notification as read endpoint - To be implemented' });
});

module.exports = router;