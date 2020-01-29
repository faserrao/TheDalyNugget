"use strict";

const AWS           = require("aws-sdk");
const simpleParser  = require("mailparser").simpleParser;

const S3 = new AWS.S3(
{
  apiVersion: '2006-03-01',
  region: process.env.DN_AWS_REGION,
});

AWS.config.update(
{
  region: process.env.DN_AWS_REGION
});

exports.getEmailFromBucket = async function (emailRecord)
{
  console.log("Entering getEmailFromBucket()");

  console.log("getEmailFromBucket(): emailRecord.eventSource = ", emailRecord.eventSource);
  console.log("getEmailFromBucket(): emailRecord.s3 = ", emailRecord.s3);
  console.log("getEmailFromBucket(): emailRecord.s3.bucket = ", emailRecord.s3.bucket);
  console.log("getEmailFromBucket(): emailRecord.s3.bucket.name = ", emailRecord.s3.bucket.name);

  console.log("getEmailFromBucket(): record = ", emailRecord);
  console.log("getEmailFromBucket(): record.eventSource = ", emailRecord.eventSource);
  console.log("getEmailFromBucket(): record.s3 = ", emailRecord.s3);
  console.log("getEmailFromBucket(): record.s3.bucket = ", emailRecord.s3.bucket);
  console.log("getEmailFromBucket(): record.s3.bucket.name = ", emailRecord.s3.bucket.name);

  const request =
  {
    Bucket: emailRecord.s3.bucket.name,
    Key:    emailRecord.s3.object.key,
  };

  let emailData;
  let email;
  let geError = false;

  try
  {
    emailData = await S3.getObject(request).promise();
    console.log("getEmailFromBucket(): emailData.Body:" , emailData.Body);
    email = await simpleParser(emailData.Body);
  }
  catch (s3Error)
  {
    console.log("getEmailFromBucket(): s3Error: ", s3Error);
    console.log("getEmailFromBucket(): s3Error: ", s3Error.stack);
    geError = true;
  }

  console.log("Leaving getEmailFromBucket()");

  return({email:email, error:geError});
};
