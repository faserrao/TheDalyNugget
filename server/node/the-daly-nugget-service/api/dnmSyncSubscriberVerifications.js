"use strict";

const AWS       = require("aws-sdk");

const SES = new AWS.SES(
{
  region: process.env.DN_AWS_REGION
});

exports.getPendingIdentities = async function (db)
{
  console.log("Entering getPendingIdentities()");

	const dbscanWithFilterParams =
	{
    ExpressionAttributeNames:
    {
      "#E":  "email",
      "#VS": "verificationStatus"
    },
    ExpressionAttributeValues:
    {
      ":vs":
      {
        S: "Success"
      }
    },
    FilterExpression: "verificationStatus <> :vs",
    ProjectionExpression: "#E, #VS",
    TableName: process.env.NUGGET_SUBSCRIBER_TABLE
	};

  let scanError = false;
  let pendingIdentities = [];

  try
  {
    let scanData = await db.scan(dbscanWithFilterParams).promise();
    console.log("getPendingIdentitie: scanData = ", JSON.stringify(scanData));

    for (let i = 0; i < scanData.Count; i++)
    {
      pendingIdentities[i] = scanData.Items[i].email.S;
      console.log("getPendingIdentities: pendingIdentities[i] = ", pendingIdentities[i]);
    }
  }
  catch (error)
  {
    console.log("db.scan(): ERROR = " + error);
    console.log("db.scan(): error.stack = " + error.stack);
    scanError = true;
  }

  console.log("Leaving getPendingIdentities()");

  return({pendingIdentities: pendingIdentities, error: scanError});
};


exports.getIDVerificationAttributes = async function (identities)
{
  console.log("Entering getIDVerificationAttributes()");

  const sesGetIvaParams =
  {
    Identities: identities
  };

  let sesGetError = false;
  let verificationData;

  try
  {
    verificationData = await SES.getIdentityVerificationAttributes(sesGetIvaParams).promise();
    console.log("getIDVerificationAttributes(): verificationData.VerificationAttributes = ", verificationData.VerificationAttributes);
  }
  catch(sesError)
  {
    console.log("ERROR = " + sesError);
    console.log("sesError.stack = " + sesError.stack);
    sesGetError = true;
  }

  console.log("Leaving getIDVerificationAttributes()");

  return({verificationAttributes: verificationData.VerificationAttributes, error: sesGetError});
};


exports.updateVerificationStatus = async function (db, verAttr)
{
  console.log("Entering updateVerificationStatus()");
  console.log("updateVerificationStatus(): verrAttr = ", verAttr);

  var verStat = [];
  var emails = [];

  for (var prop in verAttr)
  {
    if (verAttr.hasOwnProperty(prop))
    {
			emails.push(prop);
      verStat.push(verAttr[prop].VerificationStatus);
      console.log("updateVerificationStatus(): prop = ", prop);
    }
  }


/* 2019-07-27T05:50:36.752Z  42fc5167-95de-4b8f-b6ef-21ce47f3371e  updateVerificationStatus(): verrAttr = { 'faserrao@comcast.net': { VerificationStatus: 'Success' },
'facricenti@gmail.com': { VerificationStatus: 'Success' },
'faserrao@gmail.com': { VerificationStatus: 'Success' } }
*/

  for (let index = 0; index < emails.length; index++)
  {
    console.log("updateVerificationStatus(): verStat[index] = ", verStat[index]);
    console.log("updateVerificationStatus(): emails[index] = ", emails[index]);

/*
    const  = fruitsToGet[index]

    if (!verAttr.hasOwnProperty(prop)) continue;
*/
    const updateParams =
    {
      ExpressionAttributeNames:
      {
        "#VS": "verificationStatus"
      },
      ExpressionAttributeValues:
      {
        ":vs":
        {
          S: verStat[index]
        }
      },
      Key:
      {
        "email":
        {
          S: emails[index]
        }
      },
      ReturnValues: "ALL_NEW",
      TableName: process.env.NUGGET_SUBSCRIBER_TABLE,
      UpdateExpression: "SET #VS = :vs"
    };

    console.log("updateVerificationStatus(): updateParams = ", updateParams);

    try
    {
      let updateData = await db.updateItem(updateParams).promise();
      console.log("updateVerificationStatus(): updateData = ", updateData);
      console.log("Leaving updateVerificationStatus()");
      return (false);
    }
    catch (error)
    {
      console.log("updateVerificationStatus(): db.updateItem(): error = " + error);
      console.log("updateVerificationStatus(): db.updateItem(): error.stack = " + error.stack);
      console.log("Leaving updateVerificationStatus()");
      return (true);
    }
  }
};
