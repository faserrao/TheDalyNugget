"use strict";

const lambdaLog         = require("./dnmLogLambda.js").lambdaLog;
const db                 = require("./dnmDbObjects.js").db;
const getNuggetOfTheDay  = require("./dnmGetNuggetOfTheDay.js").getNuggetOfTheDay;

exports.handler = async (event, context) =>
{
  console.log("Lambda: Entering getNuggetOfTheDay()");

  lambdaLog('getNuggetOfTheDay', context, event);

  // Lambdas cache globals so need to reload the error code
  // structure - or the same message as the last Lambda call
  // will be reused.
  //
  delete require.cache[require.resolve("./dnmResponseCodes.js")];

  let RESPONSE  = require("./dnmResponseCodes.js").RESPONSE;

  let data = await getNuggetOfTheDay(db);

  if (data.error === true)
  {
    console.log("Lambda getNuggetOfTheDay(): Error returned by getNuggetOfTheDay()");
    console.log("Lambda: Leaving getNuggetOfTheDay()");
    return(RESPONSE.ERROR_DATABASE_SCAN);
  }
  else
  {
    let nugget = data.nugget;
    console.log("Lambda getNuggetOfTheDay(): nugget = ", JSON.stringify(nugget));
    RESPONSE.OK_PAYLOAD.message.push({"quote":nugget.quote, "author":nugget.author, "category":nugget.category});
    console.log("Lambda: Leaving getNuggetOfTheDay()");
    return(RESPONSE.OK_PAYLOAD);
  }
};
