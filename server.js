const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/client/build')));

const server = app.listen(8000, '0.0.0.0', () => {
  console.log('Server started on port: ', 8000);
});

// zezwala wszystkim adresom z podanego wzorca sieci dostęp do serwera

/*const allowedOrigins = [
  'http://localhost:3000',
  /^http:\/\/192\.168\.0\.\d{1,3}$/
];

const io = socket(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(allowedOrigin => allowedOrigin instanceof RegExp ? allowedOrigin.test(origin) : allowedOrigin === origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});
*/

const io = socket(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://192.168.0.200'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

let tasks = [];

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

io.on('connection', (socket) => {
  console.log(`Getting data for socket id: ${socket.id}`);
  socket.emit('updateData', tasks);

  socket.on('addTask', (data) => {
    tasks.push({ task: data.task, id: data.id });
    console.log('Task added.');
    socket.broadcast.emit('addTask', data);
  });

  socket.on('removeTask', (taskId) => {
    const taskIdIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIdIndex !== -1) {
      const removedTask = tasks.splice(taskIdIndex, 1);
      io.emit('updateData', tasks);
      console.log('Task removed.');
    }
  });
});
