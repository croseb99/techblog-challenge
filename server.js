const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const { SequelizeStore } = require("connect-session-sequelize");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
const sequelizeSessionStore = new SequelizeStore({
  db: require("./config/connection"),
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sequelizeSessionStore,
    cookie: { maxAge: 600000 },
  })
);

sequelizeSessionStore.sync();

// Routes
app.use(require("./routes/homeRoutes"));
app.use(require("./routes/authRoutes"));
app.use(require("./routes/postRoutes"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
