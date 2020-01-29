"use strict";

const sendScheduledNuggets = require("./dnmSendScheduledNuggets.js").sendScheduledNuggets;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: sendNuggetsDaily()");

  await sendScheduledNuggets("daily");

  console.log("Leaving Lambda: sendNuggetsDaily()");

  return;
};
