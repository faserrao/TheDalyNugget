"use strict";

exports.buildRandomNuggetScanString = async function (topic, author)
{
  console.log("Entering dnmBuildRandomNuggetScanString()");

  var scanString;

  if (!topic && !author)
  {
    console.log("dnmBuildRandomNuggetScanString(): author and topic do not exist");
    scanString = {TableName: process.env.NUGGET_BASE_TABLE};
  } 
  else if (topic && !author)
  {
    console.log("dnmBuildRandomNuggetScanString(): author exists");
    scanString =
    {
      ExpressionAttributeNames:
      {
        "#T": "topic",
      },
      ExpressionAttributeValues:
      {
        ":t":
        {
          S: topic
        }
      },
      FilterExpression: "#T = :t",
      TableName: process.env.NUGGET_BASE_TABLE
    };
  }
  else if (!topic && author)
  {
    console.log("dnmBuildRandomNuggetScanString(): topic exists");
    scanString =
    {
      ExpressionAttributeNames:
      {
        "#A": "author",
      },
      ExpressionAttributeValues:
      {
        ":a":
        {
          S: author
        }
      },
      FilterExpression: "#A = :a",
      TableName: process.env.NUGGET_BASE_TABLE
    };
  }
  else if (topic && author)
  {
    console.log("dnmBuildRandomNuggetScanString(): author and topic exist");
    scanString =
    {
      ExpressionAttributeNames:
      {
        "#A": "author",
        "#T": "topic",
      },
      ExpressionAttributeValues:
      {
        ":a":
        {
          S: author
        },
        ":t":
        {
          S: topic
        }
      },
      FilterExpression: "#A = :a and #T = :t",
      TableName: process.env.NUGGET_BASE_TABLE
    };
  }

  console.log("dnmBuildRandomNuggetScanString(): scanString = ", scanString);

  console.log("Leaving dnmBuildRandomNuggetScanString()");

  return(scanString);
};
