"use strict";

const db                = require("./dnmDbObjects.js").db;
const createNuggeteer   = require("./dnmCreateNuggeteer.js").createNuggeteer;
const RESPONSE          = require("./dnmResponseCodes.js").RESPONSE;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: createNuggeteer()");

  if(!event.body.email)
  {
    console.log("Leaving Lambda: createNuggeteer()");
    return(RESPONSE.ERROR_EMAIL_MISSING);
  }

  console.log("Lambda: createNuggeteer(): event.body.email = ", event.body.email);

  let phone;

  if(!event.body.phone)
  {
    phone = "0000000000";
  }
  else
  {
    phone = event.body.phone;
  }

  console.log("Lambda: createNuggeteer(): phone = ", phone);

  let nuggeteerContactInfo =
  {
    email: event.body.email,
    phone: phone
  };
 
  // If we get an err, we'll assume it's a duplicate email and send an
  // appropriate message return callback(null, RESPONSE.DUPLICATE);

  let error = await createNuggeteer(db, nuggeteerContactInfo);
  if (error)
  {
    console.log("Lambda: createNuggeteer(): error: ", error);
    console.log("Leaving Lambda: createNuggeteer()");
    return(RESPONSE.ERROR_DUPLICATE_REGISTRATION);
  }
  else
  {
    console.log("Leaving Lambda: createNuggeteer()");
    return(RESPONSE.OK);
  }
};
