require("dotenv").config();

const express = require("express");
const {
  sequelize
} = require("./models");

const participantService = require('./domains/participants').service;
const userService = require('./domains/users').service;
const blogsService = require('./domains/blogs').service;
const eventService = require('./domains/events').service;
const roleService = require('./domains/roles').service
const roles = require('./routers/roles')

const app = express();
const PORT = process.env.PORT || Number(process.env.APP_PORT) || 8080;

app.use(express.json());

app.use('/participants', participantService);
app.use('/users', userService);
app.use('/blog', blogsService);
app.use('/events', eventService);
app.use('/role', roles)

// db connect
sequelize
  .authenticate()
  .then(async () => {
    console.info("db connection established");

    // express server starting
    app.listen(PORT, () => {
      console.info(`app listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.info("unable to connect to database");
    console.error(err);
  });