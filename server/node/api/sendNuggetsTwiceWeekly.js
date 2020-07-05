"use strict";

const lambdaLog            = require("./dnmLogLambda.js").lambdaLog;
const sendScheduledNuggets = require("./dnmSendScheduledNuggets.js").sendScheduledNuggets;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: sendNuggetsTwiceWeekly()");

  lambdaLog('sendNuggetsTwiceWeekly', context, event);

  await sendScheduledNuggets("twiceWeekly");

  console.log("Leaving Lambda: sendNuggetsTwiceWeekly()");

  return;
};
