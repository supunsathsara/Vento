const TicketService = require('../services/TicketService');
const EventService = require('../services/EventService');

class TicketController {
  static async purchaseTicket(req, res) {
    try {
      const { eventId, customerName, customerEmail, quantity } = req.body;

      if (!eventId || !customerName || !customerEmail || !quantity) {
        return res.status(400).json({
          message: 'Event ID, customer name, email and quantity are required'
        });
      }

      const ticketService = await TicketService.getInstance();
      const ticket = await ticketService.createTicket({
        eventId,
        customerName,
        customerEmail,
        quantity
      });

      res.status(201).json({
        message: 'Ticket created successfully',
        ticket
      });
    } catch (error) {
      if (error.message.includes('required') || error.message.includes('must be')) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === 'Failed to reserve tickets') {
        return res.status(400).json({ message: 'No tickets available' });
      }
      console.error('Purchase ticket error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getTicket(req, res) {
    try {
      const { ticketId } = req.params;
      const ticketService = await TicketService.getInstance();
      const ticket = await ticketService.getTicket(ticketId);

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      res.json(ticket);
    } catch (error) {
      console.error('Get ticket error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async validateTicket(req, res) {
    try {
      const { ticketId } = req.params;
      const ticketService = await TicketService.getInstance();
      const result = await ticketService.validateTicket(ticketId);

      res.json(result);
    } catch (error) {
      if (error.message === 'Ticket not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Ticket not paid' || error.message === 'Event has expired') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Validate ticket error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getTicketsByEmail(req, res) {
    try {
      const { email } = req.params;
      const ticketService = await TicketService.getInstance();
      const tickets = await ticketService.getTicketsByEmail(email);

      res.json(tickets);
    } catch (error) {
      console.error('Get tickets by email error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateTicketStatus(req, res) {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const ticketService = await TicketService.getInstance();
      const ticket = await ticketService.updateTicketStatus(ticketId, status);

      res.json({
        message: 'Ticket status updated successfully',
        ticket
      });
    } catch (error) {
      if (error.message === 'Ticket not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Invalid ticket status') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Update ticket status error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = TicketController;