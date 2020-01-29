"use strict";

exports.deleteSubscriber = async function (db, email)
{
  console.log("deleteSubscriber(): Entering deleteSubscriber()");
	var params =
	{
		Key:
		{
			"email":
			{
				S: email
			}, 
		}, 
		TableName: process.env.NUGGET_SUBSCRIBER_TABLE
	}; 

  let deleteItemPromise = db.deleteItem(params).promise();

  try
  {
    let deleteItemData = await deleteItemPromise;
    console.log ("deleteSubscriber(): deleteItemData = ", deleteItemData);
    console.log("Leaving deleteSubscriber()");
    return(false);
  }
  catch(deleteError)
	{
    console.log("deleteSubscriber(): deleteItem() error:", deleteError);
    console.log("Leaving deleteSubscriber()");
    return(true);
	}
};
