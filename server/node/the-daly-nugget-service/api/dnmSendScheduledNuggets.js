"use strict";

const db                  = require("./dnmDbObjects.js").db;
const getRandomNugget     = require("./dnmGetRandomNugget.js").getRandomNugget;
const getNuggeteers       = require("./dnmGetNuggeteersByDeliveryFrequency.js").getNuggeteersByDeliveryFrequency;
const sendNuggetEmail     = require("./dnmSendNuggetEmail.js").sendNuggetEmail;
const sendNuggetSms       = require("./dnmSendNuggetSms.js").sendNuggetSms;

exports.sendScheduledNuggets = async (deliveryFrequency) =>
{
  console.log("Entering SendScheduledNuggets()");
  console.log("sendScheduledNuggets(): Delivery frequency= ", deliveryFrequency);

  let randomNuggetPromise   = getRandomNugget(db);
  let getNuggeteersPromise  = getNuggeteers(db, deliveryFrequency);

  let randomNuggetData    = await randomNuggetPromise;
  let getNuggeteersResult = await getNuggeteersPromise;

  if (randomNuggetData.error === true)
  {
    console.log("SendScheduledNuggets(): Error: funcGetRandomNugget() call");
    console.log("Leaving sendScheduledNuggets()");
    return;
  }

  if (getNuggeteersResult.error === true)
  {
    console.log("SendScheduledNuggets(): Error: funcGetNuggeteers() call");
    console.log("Leaving sendScheduledNuggets()");
    return;
  }

  console.log("SendScheduledNuggets(): randomNuggetData = ", randomNuggetData.randomNugget);
  console.log("SendScheduledNuggets(): getNuggeteersResult.nuggeteerData = ", getNuggeteersResult.nuggeteerData);

  let recipientData = getNuggeteersResult.nuggeteerData;

  let smsRecipients = recipientData.filter(function(recipientData)
  {
    return ((recipientData.deliveryMethod == "sms" || recipientData.deliveryMethod == "emailsms") && recipientData.phone != "0000000000");
  });

  let emailRecipients = recipientData.filter(function(recipientData)
  {
    return ((recipientData.deliveryMethod == "email" || recipientData.deliveryMethod == "emailsms"));
  });

  await sendNuggetEmail(randomNuggetData.randomNugget, emailRecipients);
  await sendNuggetSms(randomNuggetData.randomNugget, smsRecipients);

  console.log("Leaving sendScheduledNuggets()");

  return;
};
