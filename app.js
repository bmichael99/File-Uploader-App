const { body, validationResult } = require("express-validator");
const pool = require("./db/pool");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs")
const LocalStrategy = require('passport-local').Strategy;
const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();


//imports the express framework
const express = require("express");
//node module for handling paths
const path = require("path");
//initalizes the express application
const app = express();


//set the folder containing view templates to ./views
app.set("views", path.join(__dirname, "views"));
//set the view engine to EJS, for rendering .ejs files with res.render()
app.set("view engine", "ejs");

// sets up middleware to serve static files (CSS,images,etc) from
// the public directory
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

//parse form data into req.body
app.use(express.urlencoded({ extended: true }));


/**
 *  -------------------- PASSPORT SETUP --------------------
 */

const sessionStore = new pgSession({
    pool : pool,                // Connection pool
    createTableIfMissing : true,
    // Insert other connect-pg-simple options here
  });

//passport setup
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_PASSWORD,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 *24
  },
 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

/**
 *  -------------------- ROUTER AND SERVER --------------------
 */

//serve index router when root is visited
const indexRouter = require("./routes/indexRouter");
app.use("/",indexRouter);

//starts the server and listens on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`My Express app - listening on port ${PORT}!`);
});