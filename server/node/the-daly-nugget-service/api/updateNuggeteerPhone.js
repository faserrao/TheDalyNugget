"use strict";

const db                    = require("./dnmDbObjects.js").db;
const updateNuggeteerPhone  = require("./dnmUpdateNuggeteerPhone.js").updateNuggeteerPhone;
const RESPONSE              = require("./dnmResponseCodes.js").RESPONSE;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: updateNuggeteerPhone()");

  if(!event.body.email)
  {
    // If we don't get an email, we'll end our execution and send an error
    console.log("Leaving Lambda: updateNuggeteerPhone()");
    return(RESPONSE.ERROR_EMAIL_MISSING);
  }

  if(!event.body.phone)
  {
    // If we don't get an email, we'll end our execution and send an error
    console.log("Leaving Lambda: updateNuggeteerPhone()");
    return(RESPONSE.ERROR_PHONE_MISSING);
  }

  console.log("Lambda: updateNuggeteerPhone(): event.body.email = ", event.body.email);
  console.log("Lambda: updateNuggeteerPhone(): event.body.phone = ", event.body.phone);

  let nuggeteerContactInfo = 
  {
    email: event.body.email,
    phone: event.body.phone,
  };

  let error = await updateNuggeteerPhone(db, nuggeteerContactInfo);
  if (error)
  {
    console.log("Leaving Lambda: updateNuggeteerPhone()");
    console.log("Lambda: updateNuggeteerPhone(): updateNuggeteerPhone() error: ", error);
    return(RESPONSE.ERROR_UPDATE_ITEM);
  }
  else
  {
    console.log("Leaving Lambda: updateNuggeteerPhone()");
    return(RESPONSE.OK);
  }
};
