"use strict";

exports.lambdaLog = function (callingFunction, context, event)
{
  console.log(callingFunction + "(): " + "ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2));
  console.log(callingFunction + "(): " + "EVENT\n" + JSON.stringify(event, null, 2));
  console.log(callingFunction + "(): " + "CONTEXT\n" + JSON.stringify(context, null, 2));
};
