"use strict";

const db                = require("./dnmDbObjects.js").db;
const RESPONSE          = require("./dnmResponseCodes.js").RESPONSE;
const deleteNuggeteer   = require("./dnmDeleteNuggeteer.js").deleteNuggeteer;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: deleteNuggeteer()");

  if (!event.body.email)
  {
    console.log("Leaving Lambda: deleteNuggeteer()");
    return(RESPONSE.ERROR_EMAIL_MISSING);
  }

  console.log("Lambda: deleteNuggeteer(): event.body.email = ", event.body.email);

  let error = await deleteNuggeteer(db, event.body.email); 
	if (error)
  {
    console.log("Lambda: deleteNuggeteer(): deleteNuggeteer() error: ", error);
    console.log("Leaving Lambda: deleteNuggeteer()");
    return(RESPONSE.ERROR_DATABASE_DELETE_ITEM);
  }
  else
  {
    console.log("Leaving Lambda: deleteNuggeteer()");
    return(RESPONSE.OK);
  }
};
