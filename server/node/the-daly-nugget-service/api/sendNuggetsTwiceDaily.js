"use strict";

const sendScheduledNuggets = require("./dnmSendScheduledNuggets.js").sendScheduledNuggets;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: sendNuggetsTwiceDaily()");

  await sendScheduledNuggets("twiceDaily", "email");

  console.log("Leaving Lambda: sendNuggetsTwiceDaily()");

  return;
};
