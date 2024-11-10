const { v4: uuid } = require('uuid');

class Ticket {
  constructor(data) {
    this.id = data.id || uuid();
    this.eventId = data.eventId;
    this.customerName = data.customerName;
    this.customerEmail = data.customerEmail;
    this.quantity = data.quantity || 1;
    this.purchaseDate = data.purchaseDate || new Date().toISOString();
    this.status = data.status || 'pending';
  }

  validate() {
    if (!this.eventId) {
      throw new Error('Event ID is required');
    }

    if (!this.customerName || this.customerName.trim().length < 2) {
      throw new Error('Customer name must be at least 2 characters long');
    }

    if (!this.customerEmail || !this.validateEmail(this.customerEmail)) {
      throw new Error('Valid email is required');
    }

    if (!this.quantity || this.quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    if (!['pending', 'paid', 'failed'].includes(this.status)) {
      throw new Error('Invalid ticket status');
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toJSON() {
    return {
      id: this.id,
      eventId: this.eventId,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      quantity: this.quantity,
      purchaseDate: this.purchaseDate,
      status: this.status
    };
  }
}

module.exports = Ticket;