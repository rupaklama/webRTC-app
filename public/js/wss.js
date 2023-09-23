// websocket events
import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webRTC.js";

// socket param is an object that contains information about the current connection
let socketIO = null;

export const registerSocketEvents = socket => {
  socketIO = socket;

  socket.on("connect", () => {
    console.log("Connected to the socket.io server from the Client!");
    // 'socket' is an object that contains information about the current connection
    // console.log(socket.id);

    store.setSocketId(socket.id);

    ui.updatePersonalCode(socket.id);
  });

  socket.on("pre-offer", data => {
    // webRTCHandler.handlePreOffer(data);
  });
};

// Sending pre-offer to server to create direct connection between two or more peers
export const sendPreOfferEvent = data => {
  // .emit() - Emit an Event from the Client to send data to the servers
  // note: need to setup our own 'custom' events to feed the need of our application
  socketIO.emit("pre-offer", data);
};
