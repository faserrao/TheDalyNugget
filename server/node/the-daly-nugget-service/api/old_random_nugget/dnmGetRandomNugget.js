"use strict";

exports.getRandomNugget = async function (db)
{
  console.log("Entering getRandomNugget()");

  let   randomNumber;
  let   upperBound;

  let   randomNugget =
  {
    quote:  undefined,
    author: undefined,
    topic:  undefined,
  };

  let scanPromise = db.scan({TableName: process.env.NUGGET_BASE_TABLE}).promise();
  let rnError = false;

	try
	{
		let data = await scanPromise;

    upperBound    = data.Items.length;
    randomNumber  = Math.floor(Math.random() * Math.floor(upperBound));

    randomNugget.quote  = data.Items[randomNumber].quote.S; 
    randomNugget.author = data.Items[randomNumber].author.S;
    randomNugget.topic  = data.Items[randomNumber].topic.S;

    console.log ("getRandomNugget(): randomNugget.nugget = ", randomNugget.quote);
    console.log ("getRandomNugget(): randomNugget.author = ", randomNugget.author);
    console.log ("getRandomNugget(): randomNugget.topic = ", randomNugget.topic);
	}
	catch (error)
	{
    console.log("getRandomNugget(): db.scan() error: ",  error);
    rnError = true;
	}

  console.log("Leaving getRandomNugget()");

  return({randomNugget:randomNugget, error:rnError});
};
