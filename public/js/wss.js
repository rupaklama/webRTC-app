// websocket events
import * as store from "./store.js";
import * as ui from "./ui.js";

export const registerSocketEvents = socket => {
  socket.on("connect", () => {
    console.log("Connected to the socket.io server from the Client!");
    // 'socket' is an object that contains information about the current connection
    // console.log(socket.id);

    store.setSocketId(socket.id);

    ui.updatePersonalCode(socket.id);
  });
};
