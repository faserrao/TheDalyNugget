"use strict";

exports.updateNuggetOfTheDay = async function (db, nugget)
{
  // Set the Nugget of the Day table's record to the
  // current Nugget.  This table is used a persistent store
  // for the Nugget of the Day.  It only contains one
  // record.  This record is updated (here) any time
  // the admin sends out a new Daily Nugget.

  console.log("Entering updateNuggetOfTheDay()");
  console.log("updateNuggetOfTheDay(): () nugget = ", nugget);

  const updateParams =
  {
    ExpressionAttributeNames:
    {
      "#Q": "quote",
      "#A": "author",
      "#C": "category"
    },
    ExpressionAttributeValues:
    {
      ":q":
      {
        S: nugget.quote
      },
      ":a":
      {
        S: nugget.author
      },
      ":c":
      {
        S: nugget.category
      }
    },
    Key:
    {
      "nodKey":
      {
        S: "NUGGET_KEY"
      }
    },
    ReturnValues:     "ALL_NEW",
    TableName:        process.env.NUGGET_OF_THE_DAY_TABLE,
    UpdateExpression: "SET #Q = :q, #A = :a, #C = :c"
  };

  let updateItemPromise = db.updateItem(updateParams).promise();

  try
  {
    let updateItemData = await updateItemPromise;
    console.log("Leaving updateNuggetOfTheDay()");
    return(false);
  }
  catch (updateError)
  {
    console.log("updateNuggetOfTheDay(): db.updateItem() error = ", updateError);
    console.log("Leaving updateNuggetOfTheDay()");
    return(true);
  }
};
