"use strict";

// io() - initiate socket.io connection in the client side to the server on the current app port
// This will help us to Send/Receive events from Client to Server or vice verse
const socket = io("/");

socket.on("connect", () => {
  console.log("Connected to the socket.io server from the Client!");
  // 'socket' is an object that contains information about the current connection
  console.log(socket.id);
});

// Receiving particular Server Event & args in the callback here
// note: the argument name can be anything here
