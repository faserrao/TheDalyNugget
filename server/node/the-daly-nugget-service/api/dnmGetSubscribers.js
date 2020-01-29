"use strict";

exports.getSubscribers = async function (db)
{
  console.log("Entering getSubscribers()");

  const retrievalParams =
  {
    TableName: process.env.NUGGET_SUBSCRIBER_TABLE,
    IndexName: "nuggetSubscriberGSI",
    KeyConditionExpression:"#VS = :vs",
    ExpressionAttributeNames:
    {
      "#VS": "verificationStatus",
    },
    ExpressionAttributeValues:
    {
      ":vs": {S: "Success"},
    },
  };

  let queryReturnData;
  let subscriberObj =
  {
    email : undefined,
  };
	let subscriberData = [];

  let queryPromise = db.query(retrievalParams).promise();

	try
	{
		queryReturnData = await queryPromise;
    console.log ("getSubscribers(): subscriberData = ", queryReturnData);
	}
	catch (queryError)
	{
    console.log("getSubscribers(): db.query() error = " + queryError);
    console.log("Leaving getSubscribers()");
    return {subscriberData: subscriberData, error: true};
  }

  for (let i = 0; i < queryReturnData.Items.length; i++)
  {
    subscriberObj.email = queryReturnData.Items[i].email.S;

    console.log ("getSubscribers(): subscriberObj = ", JSON.stringify(subscriberObj));
    subscriberData.push(subscriberObj);
  }

  console.log("Leaving getSubscribers()");

  return {subscriberData: subscriberData, error: false};
};
