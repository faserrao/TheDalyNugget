"use strict";

const AWS = require("aws-sdk");

exports.sendNuggetSms = async function (nugget, recipients)
{
  console.log("Entering sendNuggetSms()");
  console.log("sendNuggetSms(): recipients = ", JSON.stringify(recipients));
  console.log("sendNuggetSms(): nugget.quote  = ", nugget.quote);
  console.log("sendNuggetSmd(): nugget.author = ", nugget.author);

  const messageText       = "The Daily Nugget\n" +
                            nugget.quote + "\n" +
                            nugget.author + "\n" +
                            process.env.DN_URL;
  const numOfRecipients   = recipients.length;
  let   currentRecipient  = 0;

  while (currentRecipient < numOfRecipients)
  {
    let phoneNumber = recipients[currentRecipient].phone;

    let smsParams =
    {
      Message:      messageText,
      PhoneNumber:  "+1" + phoneNumber,
    };

    console.log("SendNuggeSms(): smsParams = ", JSON.stringify(smsParams));

    let publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(smsParams).promise();

    try
    {
      let publishData = await publishTextPromise;
      console.log("SendNuggeSms(): MessageID = ", publishData.MessageId);
    }
    catch(publishError)
    {
      console.log("sendNuggetSms(): publishError() Error: ", publishError);
    }

    currentRecipient = currentRecipient + 1;
  }

  console.log("Leaving sendNuggetSms()");

  return;
};
