require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');

const { sequelize } = require('./models');

const app = express();
sequelize.sync();
const server = http.createServer(app);

const corsOptions = {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credential: true,
};
const { PORT, COOKIE_SECRET } = process.env;
const io = socketIO(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(logger('dev'));
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
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'none',
    },
  }),
);

io.on('connection', (socket) => {
  console.log(`a user connected : ${socket.id}`);
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
