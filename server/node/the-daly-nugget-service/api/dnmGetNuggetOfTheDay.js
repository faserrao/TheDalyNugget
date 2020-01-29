"use strict";

exports.getNuggetOfTheDay = async function (db)
{
  console.log("Entering getNuggetOfTheDay()");

  let rnodError = false;
  let data;
  let nugget =
  {
    quote   : undefined,
    author  : undefined, 
    category: undefined, 
  };

  try
  {
    data = await db.scan({TableName: process.env.NUGGET_OF_THE_DAY_TABLE}).promise();
    nugget.quote    = data.Items[0].quote.S;
    nugget.author   = data.Items[0].author.S;
    nugget.category = data.Items[0].category.S;
    console.log("getNuggetOfTheDay(): nugget: ", data.Items[0].quote.S + " " +  data.Items[0].author.S + " " + data.Items[0].category.S);
    console.log("getNuggetOfTheDay(): nugget: ", nugget.quote + " " +  nugget.author + " " + nugget.category);
  }
  catch(scanError)
  {
    console.log("getNuggetOfTheDay(): db.scan Error: ", scanError);
    rnodError = true;
  }

  console.log("Leaving getNuggetOfTheDay()");

  return {nugget:nugget, error:rnodError};
};
