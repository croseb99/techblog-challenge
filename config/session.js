const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./connection');  // Import Sequelize connection

// Set up session store with Sequelize
const sessionStore = new SequelizeStore({
  db: sequelize,
});

module.exports = session({
  secret: process.env.SESSION_SECRET,  // Secret key to sign the session ID cookie
  resave: false,  // Don't force the session to be saved back to the store if it wasn't modified
  saveUninitialized: true,  // Save a session even if it was never modified (necessary for new sessions)
  store: sessionStore,  // Store session data in PostgreSQL using Sequelize
  cookie: {
    maxAge: 600000,  // 10 minutes (session timeout)
    httpOnly: true,  // Make the cookie inaccessible to JavaScript
    secure: false,  // Set to true if using HTTPS
  },
});
