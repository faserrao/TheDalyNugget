"use strict";

const db                                  = require("./dnmDbObjects.js").db;
const updateNuggeteerDeliveryPreferences  = require("./dnmUpdateNuggeteerDeliveryPreferences.js").updateNuggeteerDeliveryPreferences;
const RESPONSE                            = require("./dnmResponseCodes.js").RESPONSE;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: updateNuggeteerDeliveryPreferences()");

  if(!event.body.email)
  {
    console.log("Leaving Lambda: updateNuggeteerDeliveryPreferences()");
    return(RESPONSE.ERROR_EMAIL_MISSING);
  }

  console.log("Lambda: updateNuggeteerDeliveryPreferences(): event.body.email = ", event.body.email);

  if (!event.body.deliveryMethod)
  {
    console.log("Leaving Lambda: updateNuggeteerDeliveryPreferences()");
    return(RESPONSE.ERROR_DELIVERY_METHOD_MISSING);
  }

  console.log("Lambda: updateNuggeteerDeliveryPreferences(): event.body.deliveryMethod = ", event.body.deliveryMethod);

  if (!event.body.deliveryFrequency)
  {
    console.log("Leaving Lambda: updateNuggeteerDeliveryPreferences()");
    return(RESPONSE.ERROR_DELIVERY_FREQUENCY_MISSING);
  }

  console.log("Lambda: updateNuggeteerDeliveryPreferences(): event.body.deliveryFrequency = ", event.body.deliveryFrequency);

  let nuggetDeliveryPreferences = 
  {
    email:              event.body.email,
    deliveryMethod:     event.body.deliveryMethod,
    deliveryFrequency:  event.body.deliveryFrequency
  };

  let error = await updateNuggeteerDeliveryPreferences(db, nuggetDeliveryPreferences);
  if (error)
  {
    console.log("Lambda: updateNuggeteerDeliveryPreferences() error:", error);
    console.log("Leaving Lambda: updateNuggeteerDeliveryPreferences()");
    return(RESPONSE.ERROR_DATABASE_UPDATE_ITEM);
  }
  else
  {
    console.log("Leaving Lambda: updateNuggeteerDeliveryPreferences()");
    return(RESPONSE.OK);
  }
};
