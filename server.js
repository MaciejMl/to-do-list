const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

app.use(express.static(path.join(__dirname, '/client')));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

const server = app.listen(8000, () => {
  console.log('Srever started on port: ', 8000);
});

const io = socket(server);

let tasks = [];

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
      socket.broadcast.emit('removeTask', removedTask[0]);
    }
  });
});
