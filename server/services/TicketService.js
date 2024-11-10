const Database = require('../db/database');
const EventService = require('./EventService');
const Ticket = require('../models/Ticket');
const { v4: uuid } = require('uuid');

class TicketService {
  static instance = null;

  static async getInstance() {
    if (!TicketService.instance) {
      TicketService.instance = new TicketService();
    }
    return TicketService.instance;
  }

  async createTicket(ticketData) {
    const db = await Database.getInstance();
    const eventService = await EventService.getInstance();

    // Verify event exists and has available tickets
    const success = await eventService.purchaseTickets(
      ticketData.eventId,
      ticketData.quantity
    );

    if (!success) {
      throw new Error('Failed to reserve tickets');
    }

    const ticket = new Ticket({
      id: uuid(),
      ...ticketData,
      purchaseDate: new Date().toISOString(),
      status: 'pending'
    });

    ticket.validate();

    await db.run(
      `INSERT INTO tickets (id, eventId, customerName, customerEmail, purchaseDate, status, quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        ticket.id,
        ticket.eventId,
        ticket.customerName,
        ticket.customerEmail,
        ticket.purchaseDate,
        ticket.status,
        ticket.quantity
      ]
    );

    return ticket;
  }

  async getTicket(ticketId) {
    const db = await Database.getInstance();
    const ticket = await db.get(
      'SELECT * FROM tickets WHERE id = ?',
      [ticketId]
    );
    return ticket ? new Ticket(ticket) : null;
  }

  async updateTicketStatus(ticketId, status) {
    const db = await Database.getInstance();
    const ticket = await this.getTicket(ticketId);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (!['pending', 'paid', 'failed'].includes(status)) {
      throw new Error('Invalid ticket status');
    }

    await db.run(
      'UPDATE tickets SET status = ? WHERE id = ?',
      [status, ticketId]
    );

    return this.getTicket(ticketId);
  }

  async getTicketsByEvent(eventId) {
    const db = await Database.getInstance();
    const tickets = await db.query(
      'SELECT * FROM tickets WHERE eventId = ?',
      [eventId]
    );
    return tickets.map(ticket => new Ticket(ticket));
  }

  async getTicketsByEmail(email) {
    const db = await Database.getInstance();
    const tickets = await db.query(
      'SELECT * FROM tickets WHERE customerEmail = ?',
      [email]
    );
    return tickets.map(ticket => new Ticket(ticket));
  }

  async validateTicket(ticketId) {
    const ticket = await this.getTicket(ticketId);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    if (ticket.status !== 'paid') {
      throw new Error('Ticket not paid');
    }

    const eventService = await EventService.getInstance();
    const event = await eventService.getEvent(ticket.eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    const eventDate = new Date(`${event.date} ${event.time}`);
    if (eventDate < new Date()) {
      throw new Error('Event has expired');
    }

    return {
      valid: true,
      ticket,
      event
    };
  }

  async getTicketStats() {
    const db = await Database.getInstance();
    const stats = await db.get(`
      SELECT 
        COUNT(*) as totalTickets,
        SUM(CASE WHEN status = 'paid' THEN quantity ELSE 0 END) as soldTickets,
        SUM(CASE WHEN status = 'pending' THEN quantity ELSE 0 END) as pendingTickets
      FROM tickets
    `);
    
    return {
      total: stats.totalTickets || 0,
      sold: stats.soldTickets || 0,
      pending: stats.pendingTickets || 0
    };
  }
}

module.exports = TicketService;