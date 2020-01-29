"use strict";

exports.deleteNuggeteer = async function (db, email)
{
  console.log("Entering deleteNuggeteer()");

	var params =
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

  let deleteItemPromise = db.deleteItem(params).promise();

  try
  {
    let deleteItemData = await deleteItemPromise;
    console.log ("deleteNuggeteer(): deleteItemData = ", deleteItemData);
    console.log("Leaving deleteNuggeteer()");
    return(false);
  }
  catch(deleteError)
	{
    console.log("deleteNuggeteer(): deleteItem() error:", deleteError);
    console.log("Leaving deleteNuggeteer()");
    return(true);
	}
};
