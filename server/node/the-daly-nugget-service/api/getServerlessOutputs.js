// Ignore
"use strict";

const AWS     = require('aws-sdk');
const s3      = new AWS.S3();

// TODO: Bucket should be created in CloudFormation, but it
//       will be a random - so need to get it from the event
//       or somewhere else.
// TODO: File name should be created in CloudFormation.

const BUCKET_NAME = process.env.DN_S3_STACK_OUTPUT_BUCKET;
const FILE_NAME = process.env.DN_S3_STACK_OUTPUT_FILE_NAME;

exports.handler = (event, context, callback) =>
{
  console.log("Lambda: Entering getServerlessOutputs()");

  delete require.cache[require.resolve("./dnmResponseCodes.js")];
  let   RESPONSE  = require("./dnmResponseCodes.js").RESPONSE;

  console.log("Lambda: getServerletsOutputs(): event = ", JSON.stringify(event))
  console.log("Lambda: getServerletsOutputs(): context = ", JSON.stringify(context))

  console.log("Lambda: getServerletsOutputs(): BUCKET_NAME = ", BUCKET_NAME);
  console.log("Lambda: getServerletsOutputs(): FILE_NAME = ", FILE_NAME);

  const params = {Bucket: BUCKET_NAME, Key: FILE_NAME};

  s3.getObject(params, function (err, data)
  {
    if (!err)
    {
      const content = data.Body.toString();

      console.log("Lambda: getServerletsOutputs(): content = ", content);

      const jsonObject = JSON.parse(content);

      console.log("Lambda: getServerletsOutputs(): jsonObject = ", jsonObject);
      
      let userPoolId = jsonObject.userPoolId;
      let userPoolClientId = jsonObject.userPoolClientId;
      let identityPoolId = jsonObject.identityPoolId;

      console.log("Lambda: getServerletsOutputs(): userPoolId = ",  userPoolId);
      console.log("Lambda: getServerletsOutputs(): userPoolClientId = ",  userPoolClientId); 
      console.log("Lambda: getServerletsOutputs(): identityPoolId = ",  identityPoolId);

      RESPONSE.OK_PAYLOAD.message.push({"userPoolId": userPoolId,
                                        "userPoolClientId": userPoolClientId,
                                        "identityPoolId": identityPoolId});

      console.log("Lambda: getServerletsOutputs(): RESPONSE.OK_PAYLOAD = ", RESPONSE.OK_PAYLOAD);                                        

      callback(null, RESPONSE.OK_PAYLOAD);
    }
    else
    {
      console.log("Lambda: getServerletsOutputs(): err = ", err);
      console.log("Lambda: Leaving getServerletsOutputs()");
      callback(null, RESPONSE.ERROR_S3_GET_OBJECT);
    }
  });
};
