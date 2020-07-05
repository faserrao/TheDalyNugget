"use strict";

const lambdaLog            = require("./dnmLogLambda.js").lambdaLog;
const sendScheduledNuggets = require("./dnmSendScheduledNuggets.js").sendScheduledNuggets;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: sendNuggetsWeekly()");

  lambdaLog('sendNuggetsWeekly', context, event);

  await sendScheduledNuggets("weekly");

  console.log("Leaving Lambda: sendNuggetsWeekly()");

  return;
};
