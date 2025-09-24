// Admin Controller - To be implemented
const adminController = {
  getDashboard: async (req, res, next) => {
    res.status(501).json({ success: false, message: 'Admin dashboard controller not implemented yet' });
  },
  
  getUsers: async (req, res, next) => {
    res.status(501).json({ success: false, message: 'Admin users management controller not implemented yet' });
  },
  
  getVendors: async (req, res, next) => {
    res.status(501).json({ success: false, message: 'Admin vendors management controller not implemented yet' });
  },
  
  getOrders: async (req, res, next) => {
    res.status(501).json({ success: false, message: 'Admin orders management controller not implemented yet' });
  }
};

module.exports = adminController;