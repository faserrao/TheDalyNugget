"use strict";

const db            = require("./dnmDbObjects.js").db;
const getNuggeteer  = require("./dnmGetNuggeteer.js").getNuggeteer;

exports.handler = async (event, context) =>
{
  console.log("Lambda: Entering getNuggeteerDeliveryPreferences()");
  //
  // Lambdas cache globals so need to reload the error code
  // structure - or the same message as the last Lambda call
  // will be reused.
  //
  delete require.cache[require.resolve("./dnmResponseCodes.js")];

  let   RESPONSE  = require("./dnmResponseCodes.js").RESPONSE;

  console.log("Lambda: getNuggeteerDeliveryPreferences(): event.body.email = ", event.body.email);

  if(!event.body.email)
  {
    console.log("Lambda: Leaving getNuggeteerDeliveryPreferences()");
    return(RESPONSE.ERROR_EMAIL_MISSING);
  }

  let data = await getNuggeteer(db, event.body.email);

  let nuggeteer = data.nuggeteer;

  console.log("Lambda: getNuggeteerDeliveryPreferences(): data.Nuggeteer= ", data.nuggeteer);
  console.log("Lambda: getNuggeteerDeliveryPreferences(): JSON.stringify(nuggeteer) = ", JSON.stringify(nuggeteer));

	if (data.error === true)
  {
    console.log("Lambda: getNuggeteerDeliveryPreferences(): db.scan() error");
    console.log("Lambda: Leaving getNuggeteerDeliveryPreferences()");
    return(RESPONSE.ERROR_DATABASE_GET_ITEM);
	}
  else if (JSON.stringify(nuggeteer) === '{}')
  {
    console.log("Nuggeteer not found");;
    console.log("Lambda: Leaving getNuggeteerDeliveryPreferences()");
    return(RESPONSE.NOT_FOUND);
	}
  else
  {
    console.log("Lambda: getNuggeteerDeliveryPreferences(): nuggeteerData = ", nuggeteer);
    console.log("Lambda: getNuggeteerDeliveryPreferences(): Nuggeteer Found");;
    console.log("Lambda: getNuggeteerDeliveryPreferences(): nuggeteerData.item.email.S = ", nuggeteer.email);
    console.log("Lambda: Leaving getNuggeteerDeliveryPreferences()");
    RESPONSE.OK_PAYLOAD.message.push({"deliveryMethod":nuggeteer.deliveryMethod, "deliveryFrequency":nuggeteer.deliveryFrequency});

    console.log("Lambda: Leaving getNuggeteerDeliveryPreferences()");

    return(RESPONSE.OK_PAYLOAD);
	}
};
