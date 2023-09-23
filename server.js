const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

process.on("uncaughtException", err => {
  console.log("uncaught exception...shutting down");
  console.log(err.name, ":", err.message);
  process.exit(1);
});

const app = express();

// sock.io setup
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/hello", (req, res) => {
  res.status(200).send("Hello world!");
});

// note: Emit ONLY to the PARTICULAR CONNECTION
// socket.emit("message", message);

// note: Emit to EVERYONE but not to the current particular connection
// socket.broadcast.emit("message", "A new user has joined!");

// note: on callback arg, server has access to data sent by client
// socket.on("clientMessage", msg => {
//  NOTE: io.emit to send/emit to EVERYONE
//  io.emit("message", msg);

// Connected users
let connectedPeers = [];

// 'socket' param is an object that contains information about the current connection
io.on("connection", socket => {
  console.log("Socket.io server connection created in the Server!");
  connectedPeers.push(socket.id);
  console.log("connected users", connectedPeers);

  // note: listening an events in the client
  socket.on("pre-offer", data => {
    const { callType, calleePersonalCode } = data;

    const connectedPeer = connectedPeers.find(peerSockedId => peerSockedId === calleePersonalCode);

    if (connectedPeer) {
      const data = {
        callerSockedId: socket.id,
        callType,
      };

      // to() - whom to emit event to
      io.to(calleePersonalCode).emit("pre-offer", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} user is disconnected`);

    const newConnectedPeers = connectedPeers.filter(userSockedId => userSockedId !== socket.id);

    connectedPeers = newConnectedPeers;
  });
});

const port = process.env.port || 2000;

server.listen(port, () => {
  console.log(`Server is listening @ port ${port}!`);
});

process.on("unhandledRejection", err => {
  console.log("unhandled rejection...shutting down");
  console.log(err.name, ":", err.message);

  server.close(() => {
    process.exit(1);
  });
});
