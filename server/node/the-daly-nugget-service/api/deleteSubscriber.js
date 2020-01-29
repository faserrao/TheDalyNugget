"use strict";

const db                = require("./dnmDbObjects.js").db;
const RESPONSE          = require("./dnmResponseCodes.js").RESPONSE;
const deleteSubscriber  = require("./dnmDeleteSubscriber.js").deleteSubscriber;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: deleteSubscriber()");
 
  if(!event.body.email)
  {
    console.log("Leaving Lambda: deleteSubscriber()");
    return(RESPONSE.ERROR_EMAIL_MISSING);
  }

  console.log("Lambda: deleteSubscriber(): deleteSubscriber(): event.body.email = ", event.body.email);

  let error = await deleteSubscriber(db, event.body.email); 

	if (error)
  {
    console.log("Lambda: deleteSubscriber(): deleteSubscriber() error: ", error);
    console.log("Leaving Lambda: deleteSubscriber()");
    return(RESPONSE.ERROR_DATABASE_DELETE_ITEM);
  }
  else
  {
    console.log("Leaving Lambda: deleteSubscriber()");
    return(RESPONSE.OK);
  }
};
