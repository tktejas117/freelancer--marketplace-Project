const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoute = require('./routes/auth');
const protectedRoute = require('./routes/protected');
const projectRoute = require('./routes/projects');
const proposalRoute = require('./routes/proposals');
const messageRoute = require('./routes/messages');

const Message = require('./models/Message'); // Make sure the path is correct

dotenv.config();

const app = express();
const server = http.createServer(app);  // Create HTTP server from Express app

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // For testing only: allow all origins. For production, specify your frontend origin.
    methods: ['GET', 'POST'],
    allowedHeaders: ["*"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoute);
app.use('/api', protectedRoute);
app.use('/api/projects', projectRoute);
app.use('/api/proposals', proposalRoute);
app.use('/api/messages', messageRoute);

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


// Socket.IO event handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a chat room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit('userJoined', {
      userId: socket.id,
      message: 'A user joined the chat'
    });
  });

  // Handle sending messages with acknowledgment callback
  socket.on('sendMessage', async (data, callback) => {
    console.log('=== SEND MESSAGE DEBUG ===');
    console.log('Received data:', JSON.stringify(data, null, 2));
    console.log('Callback function exists:', typeof callback === 'function');

    try {
      const newMessage = new Message({
        roomId: data.roomId,
        senderId: data.senderId,
        senderUsername: data.senderUsername,
        messageText: data.messageText,
        timestamp: new Date(data.timestamp || Date.now())
      });

      console.log('About to save message:', JSON.stringify(newMessage.toObject(), null, 2));
      const savedMessage = await newMessage.save();
      console.log('Message saved successfully with ID:', savedMessage._id);

      const messageToSend = {
        _id: savedMessage._id,
        roomId: savedMessage.roomId,
        senderId: savedMessage.senderId,
        senderUsername: savedMessage.senderUsername,
        messageText: savedMessage.messageText,
        timestamp: savedMessage.timestamp
      };

      io.to(data.roomId).emit('receiveMessage', messageToSend);
      console.log('Message emitted to room:', data.roomId);

      if (callback) {
        console.log('Sending success callback');
        callback({ success: true, message: messageToSend });
        console.log('Callback sent successfully');
      } else {
        console.log('WARNING: No callback function provided');
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      if (callback) {
        console.log('Sending error callback');
        callback({ success: false, error: error.message });
      }
    }
  });

  // Leave room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });

  // Disconnect
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
  });

  // Socket errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Socket.IO connection errors
io.engine.on('connection_error', (err) => {
  console.log('Socket.IO connection error:');
  console.log('Request:', err.req);
  console.log('Error code:', err.code);
  console.log('Error message:', err.message);
  console.log('Error context:', err.context);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Socket.IO server ready and listening for connections');
});
