const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const { authenticateToken, vendorOnly } = require('../middleware/auth');

// Public routes
router.post('/purchase', TicketController.purchaseTicket);
router.get('/:ticketId', TicketController.getTicket);
router.get('/validate/:ticketId', TicketController.validateTicket);
router.get('/email/:email', TicketController.getTicketsByEmail);

// Vendor protected routes
router.patch('/:ticketId/status',
  authenticateToken,
  vendorOnly,
  TicketController.updateTicketStatus
);

module.exports = router;