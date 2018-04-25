import routers from "./routes";
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import passport from 'passport';
import config from '../config'

export default path => {
  // Create Instance of Express
  const app = express();

  // Run Morgan for Logging
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(`${path}/client`));
  app.use(passport.initialize());
  app.use("/api/portfolio", routers.portfolio);
  app.use("/api/stock", routers.stock);
  app.use("/api/user", routers.user);
  //app.disable('etag');

  // load passport strategies
const localSignupStrategy = require('./passport/local-signup');
const localLoginStrategy = require('./passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authorization checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


  // Any non API GET routes will be directed to our React App and handled by React Router
  app.get("*", (req, res) => {
    res.sendFile(`${path}/client/index.html`);
  });

  return app;
  // -------------------------------------------------
};
