const { body, validationResult } = require("express-validator");
const prisma = require("./db/prisma");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs")
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
//const pgSession = require('connect-pg-simple')(session);
require('dotenv').config();

const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const db = require("./db/queries")

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

/*
const sessionStore = new pgSession({
    pool : pool,                // Connection pool
    createTableIfMissing : true,
    // Insert other connect-pg-simple options here
  });
*/

const sessionStore = new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: false,
        dbRecordIdFunction: undefined,
      }
    );

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
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.errors = req.flash('errors');
  res.locals.clipboard = req.flash('clipboard');
  next();
});


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {

      const user = await prisma.user.findUnique({
        where: {username: username}
      });

      if (!user) {
        //req.flash("errors", "Incorrect username, sign up instead?");
        return done(null, false, { message: "Incorrect username, sign up instead?" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        //req.flash("errors", "Incorrect password");
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
    const user = await prisma.user.findUnique({
        where: {id: id}
      });

    done(null, user);
  } catch(err) {
    done(err);
  }
});

//middleware for providing user data to all authenticated EJS files
app.use((req,res,next) => {
  res.locals.user = req.isAuthenticated ? (req.isAuthenticated() ? req.user : null) : null;
  next();
})

/**
 *  -------------------- ROUTERS --------------------
 */

//serve index router when root is visited
const indexRouter = require("./routes/indexRouter");
app.use("/",indexRouter);

/**
 * -------------------- ERROR HANDLING --------------------
 */

app.use((err, req, res, next) => {
  console.error(err); // Log unexpected errors
  res.redirect("/");
  //res.status(500).json({ message: 'Something went wrong' });
});

/**
 *  -------------------- SERVER --------------------
 */

//starts the server and listens on port 3000
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`My Express app - listening on port ${PORT}!`);
});

const shutdown = async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);