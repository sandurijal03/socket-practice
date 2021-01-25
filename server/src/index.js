const express = require('express');
const socket = require('socket.io');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const server = app.listen('3001', () =>
  console.log('server is running on port 3001'),
);

io = socket(server);

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log('User Joined Room: ' + data);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data.content);
  });

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED');
  });
});
