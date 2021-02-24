require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const socketIO = require('socket.io');

const { sequelize } = require('./models');
const configPassport = require('./passport');

const app = express();
const server = http.createServer(app);
sequelize.sync();
configPassport(passport);

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  credential: true,
};
const { PORT, COOKIE_SECRET } = process.env;
const io = socketIO(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
if (process.env.NODE_ENV === 'production') {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'none',
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

io.on('connection', (socket) => {
  console.log(`a user connected : ${socket.id}`);
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ redirect_url: '/error' });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
