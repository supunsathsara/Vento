const EventService = require('../services/EventService');

class EventController {
  static async createEvent(req, res) {
    try {
      const eventData = {
        ...req.body,
        vendorId: req.user.id
      };

      const eventService = await EventService.getInstance();
      const event = await eventService.createEvent(eventData);

      res.status(201).json({
        message: 'Event created successfully',
        event
      });
    } catch (error) {
      if (error.message.includes('required') || error.message.includes('must be')) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Create event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getEvent(req, res) {
    try {
      const { eventId } = req.params;
      const eventService = await EventService.getInstance();
      const event = await eventService.getEvent(eventId);

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json(event);
    } catch (error) {
      console.error('Get event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAllEvents(req, res) {
    try {
      const filters = {
        category: req.query.category,
        vendorId: req.query.vendorId
      };

      const eventService = await EventService.getInstance();
      const events = await eventService.getAllEvents(filters);

      res.json(events);
    } catch (error) {
      console.error('Get all events error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateEvent(req, res) {
    try {
      const { eventId } = req.params;
      const eventService = await EventService.getInstance();
      
      // Check if event belongs to vendor
      const event = await eventService.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      if (event.vendorId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this event' });
      }

      const updatedEvent = await eventService.updateEvent(eventId, req.body);
      res.json(updatedEvent);
    } catch (error) {
      if (error.message.includes('required') || error.message.includes('must be')) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Update event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      const eventService = await EventService.getInstance();
      
      // Check if event belongs to vendor
      const event = await eventService.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      if (event.vendorId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to delete this event' });
      }

      const deleted = await eventService.deleteEvent(eventId);
      if (deleted) {
        res.json({ message: 'Event deleted successfully' });
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  static async getEventTickets(req, res) {
    try {
      const { eventId } = req.params;
      const eventService = await EventService.getInstance();
      
      const event = await eventService.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      const tickets = await eventService.getEventTickets(eventId);
      res.json(tickets);
    } catch (error) {
      console.error('Get event tickets error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getEventStats(req, res) {
    try {
      const { eventId } = req.params;
      const eventService = await EventService.getInstance();
      
      // Check if event belongs to vendor
      const event = await eventService.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      if (event.vendorId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view event stats' });
      }

      const stats = await eventService.getEventStats(eventId);
      res.json(stats);
    } catch (error) {
      console.error('Get event stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = EventController;