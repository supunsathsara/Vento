const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const { authenticateToken, vendorOnly, eventOwnerOnly } = require('../middleware/auth');

// Public routes
router.get('/', EventController.getAllEvents);
router.get('/:eventId', EventController.getEvent);

// Protected vendor routes
router.post('/',
  authenticateToken,
  vendorOnly,
  EventController.createEvent
);

router.put('/:eventId',
  authenticateToken,
  vendorOnly,
  eventOwnerOnly,
  EventController.updateEvent
);

router.delete('/:eventId',
  authenticateToken,
  vendorOnly,
  eventOwnerOnly,
  EventController.deleteEvent
);

router.get('/:eventId/tickets',
  authenticateToken,
  vendorOnly,
  eventOwnerOnly,
  EventController.getEventTickets
);

router.get('/:eventId/stats',
  authenticateToken,
  vendorOnly,
  eventOwnerOnly,
  EventController.getEventStats
);

module.exports = router;