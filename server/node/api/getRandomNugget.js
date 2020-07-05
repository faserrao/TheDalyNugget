"use strict";

const lambdaLog        = require("./dnmLogLambda.js").lambdaLog;
const db               = require("./dnmDbObjects.js").db;
const getRandomNugget  = require("./dnmGetRandomNugget.js").getRandomNugget;

exports.handler = async (event, context) =>
{
  console.log("Lambda: Entering getRandmoNugget()");

  lambdaLog('getRandomNugget', context, event);

  //
  // Lambdas cache globals so need to reload the error code
  // structure - or the same message as the last Lambda call
  // will be reused.
  //
  //
  delete require.cache[require.resolve("./dnmResponseCodes.js")];

  let RESPONSE = require("./dnmResponseCodes.js").RESPONSE;

  var topic  = undefined;
  var author = undefined;

  if(event.body.topic)
  {
    topic = event.body.topic;
    console.log("Lambda: getRandomNugget(): topic = ", topic);
  }

  if (event.body.author)
  {
    author = event.body.author;
    console.log("Lambda: getRandomNugget(): author = ", author);
  }

  let randomNuggetPromise = getRandomNugget(db, topic, author);
  let randomNuggetData    = await randomNuggetPromise;

  console.log("Lambda: getRandomNugget(): randomNuggetData = ", randomNuggetData);

  if (randomNuggetData.error === true)
  {
    console.log("Lambda: Leaving getRandmoNugget()");
    return(RESPONSE.GET_RANDOM_NUGGGET);
  }
  else
  {
    let randomNugget = randomNuggetData.randomNugget;
    RESPONSE.OK_PAYLOAD.message.push({"quote": randomNugget.quote, "author": randomNugget.author, "topic":randomNugget.topic});
    console.log("Lambda: Entering getRandmoNugget(): RESPONSE.OK_PAYLOAD = ", RESPONSE.OK_PAYLOAD);
    console.log("Lambda: Leaving getRandmoNugget()");
    return(RESPONSE.OK_PAYLOAD);
  }
};
