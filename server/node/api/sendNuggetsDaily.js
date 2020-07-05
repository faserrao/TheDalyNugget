"use strict";

const lambdaLog            = require("./dnmLogLambda.js").lambdaLog;
const sendScheduledNuggets = require("./dnmSendScheduledNuggets.js").sendScheduledNuggets;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: sendNuggetsDaily()");

  lambdaLog('sendNuggetsDaily', context, event);

  await sendScheduledNuggets("daily");

  console.log("Leaving Lambda: sendNuggetsDaily()");

  return;
};
