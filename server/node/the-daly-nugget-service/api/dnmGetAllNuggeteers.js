"use strict";

exports.getAllNuggeteers = async function (db)
{
  console.log("Entering getAllNuggeteers()");

  let queryReturnData;
  let nuggeteerObj =
  {
    email           : undefined,
    phone           : undefined,
    deliveryMethod  : undefined,
  };
	let nuggeteerData = [];

  let scanPromise = db.scan({TableName: process.env.NUGGETEER_TABLE}).promise();

	try
	{
		queryReturnData = await scanPromise;
    console.log ("getAllNuggeteers(): queryReturnData = ", queryReturnData);
	}
	catch (scanError)
	{
    console.log("getAllNuggeteers(): db.scan() error: ", scanError);
    console.log("Leaving getAllNuggeteers()");
    return {nuggeteerData: nuggeteerData, error: true};
	}

  console.log ("getAllNuggeteers(): queryReturnData.Items.length = ", queryReturnData.Items.length);

  for (let i = 0; i < queryReturnData.Items.length; i++)
  {
    nuggeteerObj                = new Object();
    nuggeteerObj.email          = queryReturnData.Items[i].email.S;
    nuggeteerObj.phone          = queryReturnData.Items[i].phone.S;
    nuggeteerObj.deliveryMethod = queryReturnData.Items[i].nuggetDeliveryMethod.S;

    console.log ("getAllNuggeteers(): nuggeteerObj = ", JSON.stringify(nuggeteerObj));
    nuggeteerData[i] = nuggeteerObj;
  }

  console.log ("getAllNuggeteers(): nuggeteerData[] = ", JSON.stringify(nuggeteerData));
  console.log ("getAllNuggeteers(): nuggeteerData[] = ", nuggeteerData);
  console.log ("getAllNuggeteers(): nuggeteerData[0] = ", JSON.stringify(nuggeteerData[0]));
  console.log ("getAllNuggeteers(): nuggeteerData[1] = ", JSON.stringify(nuggeteerData[1]));

  console.log("Leaving getAllNuggeteers()");

  return {nuggeteerData: nuggeteerData, error: false};
};
