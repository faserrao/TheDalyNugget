'use strict';

const SesSendVerificationEmail  = require("./dnmSyncSubscriberTblAndSES.js").SesSendVerificationEmail;
const SesDeleteIdentity         = require("./dnmSyncSubscriberTblAndSES.js").SesDeleteIdenity;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: syncSubscriberTblAndSES()");
  let email;

  //  event.Records.forEach((record) =>

  for (const record of event.Records)
  {
    if (record.eventName == 'INSERT')
    {
      console.log("Lambda: syncSubscriberTblAndSES(): event name = INSERT");
      email = JSON.stringify(record.dynamodb.NewImage.email.S);
      email = JSON.parse(email);
      console.log("Lambda: syncSubscriberTblAndSES(): email = ", email);
      await SesSendVerificationEmail(email);
    }
    else if (record.eventName == 'REMOVE')
    {
      console.log("Lambda: syncSubscriberTblAndSES(): event name = REEMOVE");
      email = JSON.stringify(record.dynamodb.OldImage.email.S);
      email = JSON.parse(email);
      console.log("Lambda: syncSubscriberTblAndSES(): email = ", email);
      await SesDeleteIdentity(email);
    }
	}

  console.log("Leaving Lambda: syncSubscriberTblAndSES()");

  return;
};
