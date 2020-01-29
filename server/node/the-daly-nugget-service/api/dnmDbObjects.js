"use strict";

const AWS = require("aws-sdk");

let db;

if (process.env.IS_LOCAL === 'true')
{
  db = new AWS.DynamoDB(
  {
    region:     process.env.DN_LOCAL_REGION,
    endpoint:   process.env.DN_LOCAL_DDB_ENDPOINT,
  });
}
else
{
  db = new AWS.DynamoDB();
};

module.exports.db = db;
