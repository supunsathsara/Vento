const AuthService = require('../services/AuthService');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email and password are required' 
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: 'Invalid email format'
        });
      }

      const authService = await AuthService.getInstance();
      const token = await authService.register({ email, password });

      res.status(201).json({ 
        message: 'Registration successful',
        token 
      });
    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(409).json({ message: error.message });
      }
      if (error.message.includes('must be at least')) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          message: 'Email and password are required' 
        });
      }

      const authService = await AuthService.getInstance();
      const token = await authService.login(email, password);

      res.json({ 
        message: 'Login successful',
        token 
      });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ message: error.message });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const authService = await AuthService.getInstance();
      const user = await authService.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ 
        id: user.id,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;