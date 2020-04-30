"use strict";

const db               = require("./dnmDbObjects.js").db;
const getRandomNugget  = require("./dnmGetRandomNugget.js").getRandomNugget;

exports.handler = async (event, context) =>
{
  console.log("Lambda: Entering getRandmoNugger()");

  //
  // Lambdas cache globals so need to reload the error code
  // structure - or the same message as the last Lambda call
  // will be reused.
  //
  //
  delete require.cache[require.resolve("./dnmResponseCodes.js")];

  let RESPONSE = require("./dnmResponseCodes.js").RESPONSE;

  console.log("Lambda: getRandomNugger(): event = ", JSON.stringify(event))
  console.log("cLambda: getRandomNugger(): ontext = ", JSON.stringify(context))

  var topic  = undefined;
  var author = undefined;

  if(event.body.topic)
  {
    topic = event.body.topic;
    console.log("Lambda: getRandomNugger(): topic = ", topic);
  }

  if (event.body.author)
  {
    author = event.body.author;
    console.log("Lambda: getRandomNugger(): author = ", author);
  }

  let randomNuggetPromise = getRandomNugget(db, topic, author);
  let randomNuggetData    = await randomNuggetPromise;

  console.log("Lambda: getRandomNugger(): randomNuggetData = ", randomNuggetData);

  if (randomNuggetData.error === true)
  {
    console.log("Lambda: Leaving getRandmoNugger()");
    return(RESPONSE.GET_RANDOM_NUGGGET);
  }
  else
  {
    let randomNugget = randomNuggetData.randomNugget;
    RESPONSE.OK_PAYLOAD.message.push({"nugget": randomNugget.quote, "author": randomNugget.author, "topic":randomNugget.topic});
    console.log("Lambda: Entering getRandmoNugger(): RESPONSE.OK_PAYLOAD = ", RESPONSE.OK_PAYLOAD);
    console.log("Lambda: Leaving getRandmoNugger()");
    return(RESPONSE.OK_PAYLOAD);
  }
};
