"use strict";

const RESPONSE           = require("./dnmResponseCodes.js").RESPONSE;
const db                 = require("./dnmDbObjects.js").db;
const getSubscribers     = require("./dnmGetSubscribers.js").getSubscribers;
const getAllNuggeteers   = require("./dnmGetAllNuggeteers.js").getAllNuggeteers;
const sendNuggetEmail    = require("./dnmSendNuggetEmail.js").sendNuggetEmail;


function getNuggetFromEvent(event)
{
  let nugget = {};

  event.Records.forEach((record) =>
  {
    if (record.eventName == 'MODIFY')
    {
      nugget.quote  = record.dynamodb.NewImage.quote.S;
      nugget.author = record.dynamodb.NewImage.author.S;
    }
  });
  return(nugget);
}

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: emailNuggetOfTheDay()");
  console.log("Lambda: emailNuggetOfTheDay(): event = ", JSON.stringify(event, 2));

  const nugget = getNuggetFromEvent(event);

  console.log("Lambda: emailNuggetOfTheDay(): nugget.quote  = ", nugget.quote);
  console.log("Lambda: emailNuggetOfTheDay(): nugget.author = ", nugget.author);

  let getSubscriberPromise    = getSubscribers(db);
  let getAllNuggeteerPromise  = getAllNuggeteers(db);

  let getSubscriberResult = await getSubscriberPromise;
  if (getSubscriberResult.error === true)
  {
    console.log("Lambda: emailNuggetOfTheDay(): getSubscribers() call: error");
    console.log("Leaving Lambda: emailNuggetOfTheDay()");
    return(RESPONSE.GET_SUBSCRIBERS);
  }

  let getAllNuggeteerResult = await getAllNuggeteerPromise;
  if (getAllNuggeteerResult.error === true)
  {
    console.log("Lambda: emailNuggetOfTheDay(): getAllNuggeteers() call: error");
    console.log("Leaving Lambda: emailNuggetOfTheDay()");
    return(RESPONSE.GET_NUGGGETEERS);
  }

  console.log("Lambda: emailNuggetOfTheDay(): getAllNuggeteerResult = ", JSON.stringify(getAllNuggeteerResult));
  console.log("Lambda: emailNuggetOfTheDay(): getAllNuggeteerResult.nuggeteerData = ", JSON.stringify(getAllNuggeteerResult.nuggeteerData));


  /* Not doing any error checking on the next two calls because we are sending a
   * number of emails.  If there is a send error on any particular email send
   * then we record the error in the log, but continue processing.
  */

  await sendNuggetEmail(nugget, getSubscriberResult.subscriberData);
  await sendNuggetEmail(nugget, getAllNuggeteerResult.nuggeteerData);

//  return("message"); 

  console.log("Leaving Lambda: emailNuggetOfTheDay()");

  return;
};
