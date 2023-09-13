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

// Connected users
let connectedPeers = [];

// 'socket' param is an object that contains information about the current connection
io.on("connection", socket => {
  console.log("Socket.io server connection created in the Server!");
  connectedPeers.push(socket.id);
  // console.log(connectedPeers);

  // create/listen events
  socket.on("disconnect", () => {
    console.log(`${socket.id} user is disconnected`);

    const newConnectedPeers = connectedPeers.filter(userSockedId => userSockedId !== socket.id);

    connectedPeers = newConnectedPeers;
  });

  // let count = 0;
  // socket.emit() is to send Event from our server with some data to the Client
  // note: need to setup our own 'custom' events to feed the need of our application
  // socket.emit("countUpdated", count);
  // note: the second arg value in the event above is accessible in the client on the callback function

  // note: listening an event in the client
  // socket.on("increment", () => {
  //   count++;

  // notify only particular connection in the client with updated data
  // socket.emit("countUpdated", count);

  // note: notify many connected connections at once
  //   io.emit("countUpdated", count);
  // });
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
