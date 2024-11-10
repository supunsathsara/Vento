const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

class Database {
  static instance = null;
  
  constructor() {
    this.db = null;
  }

  static async getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.initialize();
    }
    return Database.instance;
  }

  async initialize() {
    this.db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });

    await this.createTables();
  }

  async createTables() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'vendor'
      );
  
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        name TEXT,
        date TEXT,
        time TEXT,
        price REAL,
        availableTickets INTEGER,
        location TEXT,
        category TEXT,
        vendorId TEXT,
        FOREIGN KEY(vendorId) REFERENCES users(id)
      );
  
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        eventId TEXT,
        customerEmail TEXT,
        customerName TEXT,
        purchaseDate TEXT,
        status TEXT,
        quantity INTEGER,
        FOREIGN KEY(eventId) REFERENCES events(id)
      );
    `);
  }

  async query(sql, params = []) {
    return this.db.all(sql, params);
  }

  async get(sql, params = []) {
    return this.db.get(sql, params);
  }

  async run(sql, params = []) {
    return this.db.run(sql, params);
  }
}

module.exports = Database;