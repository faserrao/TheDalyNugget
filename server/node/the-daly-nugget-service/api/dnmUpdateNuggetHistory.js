"use strict";

const uuidv1        = require("uuid/v1");

exports.updateNuggetHistory = async function (db, nugget)
{
  console.log("Entering updateNuggetHistory()");
  console.log("updateNuggetHistory() nugget = ", nugget);

  const id = uuidv1();

  let nuggetHistoryDbModel =
  {
    nhKey:      {"S" : id},
    author:     {"S" : ""},
    category:   {"S" : ""},
    dateSent:   {"S" : ""},
    quote:      {"S" : ""},
  };

  nuggetHistoryDbModel.quote.S    = nugget.quote;
  nuggetHistoryDbModel.author.S   = nugget.author;
  nuggetHistoryDbModel.category.S = nugget.category;
  nuggetHistoryDbModel.dateSent.S = nugget.emailDate;

	const putParams =
	{
    TableName:  process.env.NUGGET_HISTORY_TABLE,
    Item:       nuggetHistoryDbModel,
    Expected:
    {
      quote: { Exists: false }
    },
    ReturnConsumedCapacity: "TOTAL", 
	};

  let putItemPromise = db.putItem(putParams).promise();

  try
  {
    let putItemData = await putItemPromise;
    console.log("Leaving updateNuggetHistory()");
    return (false);
  }
  catch (putError)
  {
    console.log("updateNuggetHistory(): db.putItem() error = ", putError);
    console.log("Leaving updateNuggetHistory()");
    return (true);
  }
};

// If we get an err, we'll assume it's a duplicate Nugget.
// This is not considered a fatal error, so we will just
// make note of the duplicate in the log and continue.
// ***In a production system we would probably want to warn
// the user that this particular nugget was send in
// a previous email and ask them if they want to continue.
// Maybe have a separate api function call to test for
// dups, if the user wants.***
