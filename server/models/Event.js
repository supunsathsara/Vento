class Event {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.date = data.date;
    this.time = data.time;
    this.price = data.price;
    this.availableTickets = data.availableTickets;
    this.location = data.location;
    this.category = data.category;
    this.vendorId = data.vendorId;
  }

  validate() {
    if (!this.name) throw new Error('Name is required');
    if (!this.date) throw new Error('Date is required');
    if (!this.time) throw new Error('Time is required');
    if (this.price < 0) throw new Error('Price must be positive');
    if (this.availableTickets < 0) throw new Error('Available tickets must be positive');
    if (!this.location) throw new Error('Location is required');
    if (!this.category) throw new Error('Category is required');
    if (!this.vendorId) throw new Error('Vendor ID is required');
    
    // Validate date is in future
    const eventDate = new Date(`${this.date} ${this.time}`);
    if (eventDate < new Date()) {
      throw new Error('Event date must be in the future');
    }
  }
}

module.exports = Event;