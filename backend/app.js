const express = require('express');
const http = require('http');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files statically
app.use(cors());

const server = http.createServer(app);
const io =  require('socket.io')(server, {
    cors: { 
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const onlineUser = [];

// Test socket connection from client
io.on('connection', socket => {
    // Send to all connected clients
    // console.log('Connected with socket ID: ' + socket.id);
    // socket.on('send-message-all', data => {
    //     console.log('Received message from client: ', data);
    //     socket.emit('send-message-by-server', 'Message from server: ' + data.message);
    // })

    // Send to specific socket ID
    socket.on('join-room', userId => {
        socket.join(userId);
        // console.log('User joined room: ' + userId);
    });
    socket.on('send-message', data => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('receive-message', data);
    })
    // socket.on('send-message', data => {
    //     socket.to(data.recipient).emit('receive-message', data.message);
    // })

    socket.on('clear-unread-messages', data => {
        io.to(data.members[0]).to(data.members[1])
        .emit('message-count-cleared', data);
    })

    socket.on('user-typing', data => {
        io.to(data.members[0]).to(data.members[1])
        .emit('started-typing', data);
    })

    socket.on('user-login', userId => {
        if(!onlineUser.includes(userId)) {
            onlineUser.push(userId);
        }
        socket.emit('online-users', onlineUser);
    }) 
})

module.exports = server;