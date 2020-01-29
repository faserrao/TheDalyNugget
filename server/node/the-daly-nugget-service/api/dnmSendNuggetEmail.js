"use strict";

const AWS = require("aws-sdk");

const SES = new AWS.SES(
{
  region: process.env.DN_AWS_REGION,
});

const NUM_OF_RECIPIENTS_PER_EMAIL = 3;

function setEmailParams(bccDist, emailBody)
{
  let emailParams =
  {
    Destination:
    {
      BccAddresses: bccDist,
      ToAddresses: [process.env.DN_REVS_EMAIL_ADDRESS, "faserrao@comcast.net"]
    },
    Message:
    {
      Body:
      {
        Text:
        {
          Data: emailBody
        }
      },
      Subject:
      {
        Data: process.env.DN_NUGGET_EMAIL_SUBJECT
      }
    },
    Source: process.env.DN_REVS_EMAIL_ADDRESS
  };
  return(emailParams);
};

function clearEmailDistribution()
{
  let i;
  let bccDist = [0];

  for (i = 0; i <  NUM_OF_RECIPIENTS_PER_EMAIL; i = i + 1)
  {
    bccDist[i] = undefined;
  }
  return(bccDist);
}

exports.sendNuggetEmail = async function (nugget, recipientData)
{
  console.log("Entering sendNuggetEmail()");
  console.log("sendNuggetEmail(): recipientData = ", JSON.stringify(recipientData));
  console.log("sendNuggetEmail(): nugget.quote  = ", nugget.quote);
  console.log("sendNuggetEmail(): nugget.author = ", nugget.author);

  const emailBody         = nugget.quote + "\n" + nugget.author;
  let   numOfRecipients   = recipientData.length;
  let   currentRecipient  = 0;

  console.log("sendNuggetEmail(): numOfRecipients = ", numOfRecipients);

  while (currentRecipient < numOfRecipients)
  {
    let bccDist = clearEmailDistribution();
    let i = 0;

    console.log("sendNuggetEmail(): currentRecipient = ", currentRecipient);

    while ((i < NUM_OF_RECIPIENTS_PER_EMAIL) && ((currentRecipient + i) < numOfRecipients))
    {
      console.log("sendNuggetEmail(): i = ", i);
      bccDist[i] = recipientData[currentRecipient + i].email;
      i = i + 1;
    }

    let emailParams = setEmailParams(bccDist, emailBody);

    console.log("sendNuggetEmail(): emailNUggets:eParams = ", JSON.stringify(emailParams));

    try
    {
      let emailData = await SES.sendEmail(emailParams).promise();
      console.log("sendNuggetEmail(): emailData = ", emailData);
    }
    catch (sendError)
    {
      console.log("sendNuggetEmail(): sendEmail() Error: ", sendError);
    }

    currentRecipient = currentRecipient + NUM_OF_RECIPIENTS_PER_EMAIL;
  }

  console.log("Leaving sendNuggetEmail()");

  return;
};
