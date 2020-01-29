'use strict';

const AWS       = require('aws-sdk');

const SES = new AWS.SES(
{
  region: process.env.DN_AWS_REGION
});

exports.SesSendVerificationEmail = async function (email)
{
  console.log("Entering SesSendVerificationEmail()");
  console.log("SesSendVerificationEmail(): email = ", email);
  const verificationEmailParams =
  {
    EmailAddress: email,
    TemplateName: process.env.DN_SES_CUSTOM_VERIFICATION_EMAIL_TEMPLATE_NAME,
  };

  try
  {
    let data = await SES.sendCustomVerificationEmail(verificationEmailParams).promise();
    console.log("Leaving SesSendVerificationEmail()");
    return(false);
  }
  catch(error)
  {
    console.log("SesSendVerificationEmail(): Error in sendCustomVerificationEmail()");
    console.log("SesSendVerificationEmail(): error, error.stack", error, error.stack);
    console.log("Leaving SesSendVerificationEmail()");
    return(true);
  }
};


exports.SesDeleteIdenity = async function (email)
{
  console.log("Entering SesDeleteIdenity()");
  console.log("SesDeleteIdenity(): email = ", email);

  var deleteIdentityParams =
  {
    Identity: email,
  };

  try
  {
    let data = await SES.deleteIdentity(deleteIdentityParams).promise();
    console.log("Leaving SesDeleteIdenity()");
    return(false);
  }
  catch(error)
  {
    console.log("SesDeleteIdenity(): Error in SES.deleteIdentity()");
    console.log("SesDeleteIdenity(): error, error.stack", error, error.stack);
    console.log("Leaving SesDeleteIdenity()");
    return(true);
  }
};
