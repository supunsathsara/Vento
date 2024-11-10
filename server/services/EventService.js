const Database = require('../db/database');
const Event = require('../models/Event');
const { v4: uuid } = require('uuid');

class EventService {
  constructor() {
    this.locks = new Map();
  }

  static async getInstance() {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  async createEvent(eventData) {
    const db = await Database.getInstance();
    const event = new Event({
      id: uuid(),
      ...eventData
    });

    event.validate();

    await db.run(
      `INSERT INTO events (id, name, date, time, price, availableTickets, location, category, vendorId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [event.id, event.name, event.date, event.time, event.price,
      event.availableTickets, event.location, event.category, event.vendorId]
    );

    return event;
  }

  async getEvent(eventId) {
    const db = await Database.getInstance();
    const event = await db.get(
      'SELECT * FROM events WHERE id = ?',
      [eventId]
    );
    return event ? new Event(event) : null;
  }

  async getAllEvents(filters = {}) {
    const db = await Database.getInstance();
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.vendorId) {
      query += ' AND vendorId = ?';
      params.push(filters.vendorId);
    }

    const events = await db.query(query, params);
    return events.map(event => new Event(event));
  }

  async updateEvent(eventId, updateData) {
    const db = await Database.getInstance();
    const event = await this.getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const updatedEvent = new Event({
      ...event,
      ...updateData,
      id: eventId
    });

    updatedEvent.validate();

    const updates = Object.keys(updateData)
      .map(key => `${key} = ?`)
      .join(', ');

    await db.run(
      `UPDATE events SET ${updates} WHERE id = ?`,
      [...Object.values(updateData), eventId]
    );

    return updatedEvent;
  }

  async deleteEvent(eventId) {
    const db = await Database.getInstance();
    const result = await db.run(
      'DELETE FROM events WHERE id = ?',
      [eventId]
    );
    return result.changes > 0;
  }

  async purchaseTickets(eventId, quantity) {
    if (!this.locks.has(eventId)) {
      this.locks.set(eventId, Promise.resolve());
    }

    const currentLock = this.locks.get(eventId);

    try {
      await currentLock;

      const newLock = (async () => {
        const db = await Database.getInstance();
        const event = await this.getEvent(eventId);

        if (!event) {
          throw new Error('Event not found');
        }

        if (event.availableTickets < quantity) {
          throw new Error('Not enough tickets available');
        }

        await db.run(
          'UPDATE events SET availableTickets = availableTickets - ? WHERE id = ?',
          [quantity, eventId]
        );

        return true;
      })();

      this.locks.set(eventId, newLock);
      return await newLock;
    } finally {
      if (this.locks.get(eventId) === currentLock) {
        this.locks.delete(eventId);
      }
    }
  }

  async getEventTickets(eventId) {
    const db = await Database.getInstance();
    const tickets = await db.query(
      'SELECT * FROM tickets WHERE eventId = ? ORDER BY purchaseDate DESC',
      [eventId]
    );
    return tickets;
  }

  async getEventStats(eventId) {
    const db = await Database.getInstance();
    const event = await this.getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const soldTickets = await db.get(
      'SELECT COUNT(*) as count, SUM(quantity) as total FROM tickets WHERE eventId = ?',
      [eventId]
    );

    return {
      eventId,
      totalTickets: event.availableTickets + (soldTickets.total || 0),
      soldTickets: soldTickets.total || 0,
      availableTickets: event.availableTickets,
      revenue: (soldTickets.total || 0) * event.price
    };
  }
}

module.exports = EventService;