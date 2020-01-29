"use strict";

const buildRandomNuggetScanString  = require("./dnmBuildRandomNuggetScanString.js").buildRandomNuggetScanString;

exports.getRandomNugget = async function (db, topic, author)
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

  let scanStringPromise = buildRandomNuggetScanString(topic, author);
  let scanString = await(scanStringPromise);

  console.log ("getRandomNugget(): scanString = ", scanString);

  let scanPromise = db.scan(scanString).promise();
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
