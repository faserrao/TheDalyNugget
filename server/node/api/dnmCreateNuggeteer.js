"use strict";

function getDate()
{
  const todaysDate = new Date();

  let dateSent =  todaysDate.toISOString().substring(0, 10);

  return(dateSent);
}

exports.createNuggeteer = async function (db, nuggeteerContactInfo)
{
  console.log("Entering createNuggeteer()");
  console.log("createNuggeteer(): nuggeteerContactInfo = ", JSON.stringify(nuggeteerContactInfo));

  const nuggetDate = getDate();

  let model =
  {
    email:                    {"S" : ""},
    phone:                    {"S" : ""},
    dateRegistered:           {"S" : ""},
    nuggetDeliveryMethod:     {"S" : ""},
    nuggetDeliveryFrequency:  {"S" : ""},
  };
    
  model.email.S                   = nuggeteerContactInfo.email;
  model.phone.S                   = nuggeteerContactInfo.phone;
  model.dateRegistered.S          = nuggetDate;
  model.nuggetDeliveryMethod.S    = "email";
  model.nuggetDeliveryFrequency.S = "daily";

  let putParams =
  {
    TableName: process.env.NUGGETEER_TABLE,
    Item: model,
    Expected:
    {
      email: { Exists: false }
    }
  };
    
  try
  {
    let putItemData = await db.putItem(putParams).promise();
    console.log("createNuggeteer: putItemData = ", JSON.stringify(putItemData));
    console.log("Leaving createNuggeteer()");
    return(false);
  }
  catch (putError)
  {
    console.log("createNuggeteer: db.putItem() error = ", putError);
    console.log("Leaving createNuggeteer()");
    return(true);
  }
};
