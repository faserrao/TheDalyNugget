"use strict";

const lambdaLog            = require("./dnmLogLambda.js").lambdaLog;
const sendScheduledNuggets = require("./dnmSendScheduledNuggets.js").sendScheduledNuggets;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: sendNuggetsTwiceDaily()");

  lambdaLog('sendNuggetsTwiceDaily', context, event);

  await sendScheduledNuggets("twiceDaily", "email");

  console.log("Leaving Lambda: sendNuggetsTwiceDaily()");

  return;
};
