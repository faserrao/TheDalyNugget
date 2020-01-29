"use strict";

const sendScheduledNuggets = require("./dnmSendScheduledNuggets.js").sendScheduledNuggets;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: sendNuggetsTwiceWeekly()");

  await sendScheduledNuggets("twiceWeekly");

  console.log("Leaving Lambda: sendNuggetsTwiceWeekly()");

  return;
};
