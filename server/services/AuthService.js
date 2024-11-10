const Database = require('../db/database');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

class AuthService {
  static instance = null;

  static async getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(userData) {
    const db = await Database.getInstance();
    
    const existing = await db.get(
      'SELECT email FROM users WHERE email = ?',
      [userData.email]
    );
    
    if (existing) {
      throw new Error('email already exists');
    }

    const user = new User({
      id: uuid(),
      ...userData
    });

    user.validate();
    await user.hashPassword();

    await db.run(
      'INSERT INTO users (id, email, password) VALUES (?, ?, ?)',
      [user.id, user.email, user.password]
    );

    return this.generateToken(user);
  }

  async login(email, password) {
    const db = await Database.getInstance();
    
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: 'vendor'
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
  }
}

module.exports = AuthService;