"use strict";

const VERIFICATION_STATUS_PENDING = "Pending";

exports.createSubscriber = async function (db, email)
{
  console.log("Entering createSubscriber()");
  console.log("createSubscriber() email = ", email);

  let model =
  {
    email:                {"S" : ""},
    verificationStatus:   {"S" : ""},
  };

  model.email.S               = email;
  model.verificationStatus.S  = VERIFICATION_STATUS_PENDING;
    
  let putParams =
  {
    TableName:  process.env.NUGGET_SUBSCRIBER_TABLE,
    Item:       model,
    Expected:
    {
      email: { Exists: false }
    }
  };

  let putItemPromise = db.putItem(putParams).promise();

  try
  {
    let putItemData = await putItemPromise;
    console.log("createSubscriber(): putItemData = ", putItemData);
    console.log("Leaving createSubscriber()");
    return(false);
  }
  catch (putItemError)
  {
    console.log("createSubscriber() error: ", putItemError);
    console.log("Leaving createSubscriber()");
    return(true);
  }
};
