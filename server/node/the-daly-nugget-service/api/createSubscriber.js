"use strict";

const db                = require("./dnmDbObjects.js").db;
const RESPONSE          = require("./dnmResponseCodes.js").RESPONSE;
const createSubscriber  = require("./dnmCreateSubscriber.js").createSubscriber;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: createSubscriber()");

  console.log("Lambda: createSubscriber(): event.body.email = ", event.body.email);

  if(!event.body.email)
  {
    console.log("Leaving Lambda: createSubscriber()");
    return(RESPONSE.ERROR_SUBSCRIPTION_EMAIL_MISSING);
  }

  // If we get an err, we'll assume it's a duplicate email and send an
  // appropriate message return callback(null, RESPONSE.DUPLICATE);

  let error = await createSubscriber(db, event.body.email);
  if (error)
  {
    console.log("Lambda: createSubscriber(): createSubscriber() error: ", error);
    console.log("Leaving Lambda: createSubscriber()");
    return(RESPONSE.ERROR_DUPLICATE_SUBSCRIPTION);
  }
  else
  {
    console.log("Leaving Lambda: createSubscriber()");
    return(RESPONSE.OK);
  }
};
