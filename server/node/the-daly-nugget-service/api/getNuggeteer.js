/* TODO: At this point this function is only used to check if
 * a Nuggteer already exists in the database.  But is should also
 * be able to return the record for the Nuggeteer.
*/

"use strict";

const db                = require("./dnmDbObjects.js").db;
const getNuggeteer      = require("./dnmGetNuggeteer.js").getNuggeteer;
const RESPONSE          = require("./dnmResponseCodes.js").RESPONSE;

exports.handler = async (event, context) =>
{
  console.log("Lambda: Entering getNuggeteer()");

  if(!event.body.email)
  {
    console.log("Lambda: Leaving getNuggeteer()");
    return (RESPONSE.ERROR_SUBSCRIPTION_EMAIL_MISSING);
  }

  console.log("Lambda: getNuggeteer(): event.body.email = ", event.body.email);

  let data      = await getNuggeteer(db, event.body.email);
  let nuggeteer = data.nuggeteer;

	if (data.error === true)
  {
    console.log("Lamda: getNuggeteer(): db.scan() error");
    console.log("Lambda: Leaving getNuggeteer()");
    return(RESPONSE.ERROR_DATABASE_GET_ITEM);
	}
  else if (JSON.stringify(nuggeteer) === '{}')
  {
    console.log("Lambda: getNuggeteer(): Nuggeteer not found");;
    console.log("Lambda: Leaving getNuggeteer()");
    return(RESPONSE.ERROR_NOT_REGISTERED);
	}
  else
  {
    console.log("Lambda: getNuggeteer(): data = ", JSON.stringify(data));
    console.log("Lambda: getNuggeteer(): nuggeteer = ", JSON.stringify(nuggeteer));
    console.log("Lambda: Leaving getNuggeteer()");
    return(RESPONSE.OK);
	}
};
