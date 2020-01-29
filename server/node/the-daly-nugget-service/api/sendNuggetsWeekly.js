"use strict";

const sendScheduledNuggets = require("./dnmSendScheduledNuggets.js").sendScheduledNuggets;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: sendNuggetsWeekly()");

  await sendScheduledNuggets("weekly");

  console.log("Leaving Lambda: sendNuggetsWeekly()");

  return;
};
