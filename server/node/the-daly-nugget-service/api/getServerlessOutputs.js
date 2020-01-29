// Ignore
"use strict";

const AWS     = require('aws-sdk');
const s3      = new AWS.S3();
const toml    = require('toml');

// TODO: Bucket should be created in CloudFormation, but it
//       will be a random - so need to get it from the event
//       or somewhere else.
// TODO: File name should be created in CloudFormation.

const BUCKET_NAME = process.env.DN_S3_STACK_OUTPUT_BUCKET;
const FILE_NAME = process.env.DN_S3_STACK_OUTPUT_FILE_NAME;

exports.handler = (event, context, callback) =>
{
  delete require.cache[require.resolve("./dnmResponseCodes.js")];
  let   RESPONSE  = require("./dnmResponseCodes.js").RESPONSE;

  console.log("BUCKET_NAME = ", BUCKET_NAME);
  console.log("FILE_NAME = ", FILE_NAME);

  const params = {Bucket: BUCKET_NAME, Key: FILE_NAME};

  console.log("params = ", params);

  s3.getObject(params, function (err, data)
  {
    if (!err)
    {
      const content = data.Body.toString();

      const config = toml.parse(content);

      const userPoolId = config.UserPoolId;
      const userPoolClientId = config.UserPoolClientId; 
      const identityPoolId = config.IdentityPoolId;

      console.log(userPoolId);

      RESPONSE.OK_PAYLOAD.message.push({"userPoolId": userPoolId,
                                        "userPoolClientId": userPoolClientId,
                                        "identityPoolId": identityPoolId});

      callback(null, RESPONSE.OK_PAYLOAD);
    }
    else
    {
     console.log(err);
     callback(null, RESPONSE.ERROR_S3_GET_OBJECT);
    }
  });
};
