const bcrypt = require('bcrypt');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = 'vendor';
  }

  validate() {
    if (!this.email || this.email.length < 3) {
      throw new Error('email must be at least 3 characters long');
    }
    if (!this.password || this.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

module.exports = User;