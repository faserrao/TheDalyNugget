"use strict";

exports.getNuggeteer = async function (db, email)
{
  console.log("Entering getNuggeteer()");

	const params =
	{
		Key:
		{
			"email":
			{
				S: email
			}, 
		}, 
		TableName: process.env.NUGGETEER_TABLE
	};

  let nuggeteerObj =
  {
    email                     : undefined,
    phone                     : undefined,
    deliveryMethod            : undefined,
    deliveryFrequency         : undefined,
  };

  let giError = false;

  try
  {
    let queryReturnData = await db.getItem(params).promise();

    console.log ("getNuggeteer(): queryReturnData = ", JSON.stringify(queryReturnData));
    
    if ('Item' in queryReturnData)
    {
      console.log ("getNuggeteer(): queryReturnData: 'Item' in nuggeteerObj");

      nuggeteerObj.email              = queryReturnData.Item.email.S;
      nuggeteerObj.phone              = queryReturnData.Item.phone.S;
      nuggeteerObj.deliveryMethod     = queryReturnData.Item.nuggetDeliveryMethod.S;
      nuggeteerObj.deliveryFrequency  = queryReturnData.Item.nuggetDeliveryFrequency.S;
    }
  }
	catch (getError)
	{
    console.log("getNuggeteer(): db.getItem() error: ", getError);
    giError = true;
	}

  console.log("Leaving getNuggeteer()");

  return {nuggeteer: nuggeteerObj, error: giError};
};
