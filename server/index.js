require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/event', require('./routes/event.route.js'));


// Global Error Handler. IMPORTANT function params MUST start with err
app.use((err, req, res, next) => {
    console.log(err.stack);
    console.log(err.name);
    console.log(err.code);
  
    res.status(500).json({
      message: 'Something went really wrong',
    });
  });

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

