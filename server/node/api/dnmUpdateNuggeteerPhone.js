"use strict";

exports.updateNuggeteerPhone = async function (db, nuggeteerContactInfo)
{
  console.log("Entering updateNuggeteerPhone()");
  console.log("updateNuggeteerPhone(): nuggeteerContactInfo = ", nuggeteerContactInfo);

  const updateParams =
  {
    ExpressionAttributeNames:
    {
      "#P": "phone",
    },
    ExpressionAttributeValues:
    {
      ":p":
      {
        S: nuggeteerContactInfo.phone,
      },
    },
    Key:
    {
      "email":
      {
        S: nuggeteerContactInfo.email,
      }
    },
    ReturnValues:     "ALL_NEW",
    TableName:        process.env.NUGGETEER_TABLE,
    UpdateExpression: "SET #P = :p"
  };

  try
  {
    let updateItemData = await db.updateItem(updateParams).promise();
    console.log("Leaving updateNuggeteerPhone()");
    return(false);
  }
  catch (updateError)
  {
    console.log("updateNuggeteerPhone(): updateItem() error:", updateError);
    console.log("Leaving updateNuggeteerPhone()");
    return(true);
  }
};
