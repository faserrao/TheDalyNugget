"use strict";

exports.updateNuggeteerDeliveryPreferences = async (db, nuggetDeliveryPreferences) =>
{
  console.log("Entering updateNuggeteerDeliveryPreferences()");
  console.log("updateNuggeteerDeliveryPreferences() nuggetDeliveryPreferences = ", nuggetDeliveryPreferences);

  const updateParams =
  {
    ExpressionAttributeNames:
    {
      "#NDM": "nuggetDeliveryMethod",
      "#NDF": "nuggetDeliveryFrequency"
    },
    ExpressionAttributeValues:
    {
      ":ndm":
      {
        S: nuggetDeliveryPreferences.deliveryMethod,
      },
      ":ndf":
      {
        S: nuggetDeliveryPreferences.deliveryFrequency,
      }
    },
    Key:
    {
      "email":
      {
        S: nuggetDeliveryPreferences.email,
      }
    },
    ReturnValues: "ALL_NEW",
    TableName: process.env.NUGGETEER_TABLE,
    UpdateExpression: "SET #NDM = :ndm, #NDF=:ndf"
  };

  try
  {
    let updateItemData = await db.updateItem(updateParams).promise();
    console.log("Leaving updateNuggeteerDeliveryPreferences()");
    return(false);
  }
  catch (updateError)
  {
    console.log("updateNuggeteerDeliveryPreferences(): updateItem() error:", updateError);
    console.log("Leaving updateNuggeteerDeliveryPreferences()");
    return(true);
  }
};
