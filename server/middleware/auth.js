const jwt = require('jsonwebtoken');
const EventService = require('../services/EventService');

// Verify JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Vendor only route protection
const vendorOnly = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'vendor') {
      return res.status(403).json({ message: 'Vendor access required' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const eventOwnerOnly = async (req, res, next) => {
  try {
    const eventService = await EventService.getInstance();
    const event = await eventService.getEvent(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.vendorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this event' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  authenticateToken,
  vendorOnly,
  eventOwnerOnly
};