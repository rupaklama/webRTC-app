"use strict";

import * as store from "./store.js";
import * as wss from "./wss.js";
import * as webRTCHandler from "./webRTC.js";
import * as types from "./constants.js";

// io() - initiate socket.io connection in the client side to the server on the current app port
// This will help us to Send/Receive events from Client to Server or vice verse
const socket = io("/");
wss.registerSocketEvents(socket);

// Code copy event listener
const personalCodeCopyButton = document.getElementById("personal_code_copy_button");
personalCodeCopyButton.addEventListener("click", () => {
  const personalCode = store.getState().socketId;
  // copy & write in clipboard
  navigator.clipboard && navigator.clipboard.writeText(personalCode);
});

// note: Sending pre-offer to server
// Register event listeners for Connection buttons

const personalCodeChatButton = document.getElementById("personal_code_chat_button");

personalCodeChatButton.addEventListener("click", () => {
  console.log("chat button clicked");

  // End user to connect through current user id
  const calleePersonalCode = document.getElementById("personal_code_input").value;

  const callType = types.callType.CHAT_PERSONAL_CODE;

  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});

const personalCodeVideoButton = document.getElementById("personal_code_video_button");
personalCodeVideoButton.addEventListener("click", () => {
  console.log("Video button clicked");

  const calleePersonalCode = document.getElementById("personal_code_input").value;
  const callType = types.callType.VIDEO_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, calleePersonalCode);
});
