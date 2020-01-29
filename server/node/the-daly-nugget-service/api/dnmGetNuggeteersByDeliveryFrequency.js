"use strict";

exports.getNuggeteersByDeliveryFrequency = async function (db, nuggetDeliveryFrequency)
{
  console.log("Entering getNuggeteersByDeliveryFrequency()");

  const retrievalParams =
  {
    TableName: process.env.NUGGETEER_TABLE,
    IndexName: "nuggetDeliveryGSI",
//  FilterExpression: "#PHN <> :phn",
//  FilterExpression: "(contains(#NDM, :ndm)) AND (#NDF = :ndf)",
    KeyConditionExpression:"#NDF = :ndf",
    ExpressionAttributeNames:
    {
      "#NDF": "nuggetDeliveryFrequency",
    },
    ExpressionAttributeValues:
    {
      ":ndf": {S: nuggetDeliveryFrequency},
    },
  };

  let queryReturnData;
  let nuggeteerObj =
  {
    email           : undefined,
    phone           : undefined,
    deliveryMethod  : undefined,
  };
	let nuggeteerData = [];

  let queryPromise = db.query(retrievalParams).promise();

	try
	{
		queryReturnData = await queryPromise;
    console.log ("getNuggeteersByDeliveryFrequency(): queryReturnData = ", JSON.stringify(queryReturnData));
	}
	catch (queryError)
	{
    console.log("getNuggeteersByDeliveryFrequency: db.query() error = " + queryError);
    console.log("Leaving getNuggeteersByDeliveryFrequency()");
    return {nuggeteerData: nuggeteerData, error: true};
	}

  for (let i = 0; i < queryReturnData.Items.length; i++)
  {
    nuggeteerObj.email          = queryReturnData.Items[i].email.S;
    nuggeteerObj.phone          = queryReturnData.Items[i].phone.S;
    nuggeteerObj.deliveryMethod = queryReturnData.Items[i].nuggetDeliveryMethod.S;

    console.log ("getNuggeteersByDeliveryFrequency(): nuggeteerObj = ", JSON.stringify(nuggeteerObj));
    
    nuggeteerData.push(nuggeteerObj);
  }

  console.log("Leaving getNuggeteersByDeliveryFrequency()");

  return {nuggeteerData: nuggeteerData, error: false};
};
