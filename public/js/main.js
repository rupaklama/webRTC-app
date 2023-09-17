"use strict";

import * as store from "./store.js";
import * as wss from "./wss.js";

// io() - initiate socket.io connection in the client side to the server on the current app port
// This will help us to Send/Receive events from Client to Server or vice verse
const socket = io("/");

wss.registerSocketEvents(socket);

// Receiving particular Server Event & args in the callback here
// note: the argument name can be anything here
