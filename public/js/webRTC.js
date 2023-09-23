"use strict";

import * as wss from "./wss.js";

/* WebRTC Handlers */

// Sending pre-offer to server to create direct connection between two or more peers
export const sendPreOffer = (callType, calleePersonalCode) => {
  // console.log("pre offer func executed!", callType, calleePersonalCode);

  const data = {
    callType,
    calleePersonalCode,
  };

  wss.sendPreOfferEvent(data);
};
