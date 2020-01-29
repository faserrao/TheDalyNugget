"use strict";

const db                          = require("./dnmDbObjects.js").db;
const getPendingIdentities        = require("./dnmSyncSubscriberVerifications.js").getPendingIdentities;
const getIDVerificationAttributes = require("./dnmSyncSubscriberVerifications.js").getIDVerificationAttributes;
const updateVerificationStatus    = require("./dnmSyncSubscriberVerifications.js").updateVerificationStatus;

exports.handler = async (event, context) =>
{
  console.log("Lambda Entering syncSubscriberVerifications()");
  console.log("event = ", event);

  let pendingIdentityData = await getPendingIdentities(db);
  console.log("Lambda nsyncSubscriberVerifications(): pendingIdentityData = ", pendingIdentityData);
  if (pendingIdentityData.error)
  {
    console.log("getPendingIdentitiesError()");
    console.log("Lambda: Leaving syncSubscriberVerifications()");
    return;
  }

  let verificationAttributeData = await getIDVerificationAttributes(pendingIdentityData.pendingIdentities);
  console.log("Lambda syncSubscriberVerifications(): verificationAttributeData = ", verificationAttributeData);
  if (verificationAttributeData.error)
  {
    console.log("getIDVerificationAttributesError()");
    console.log("Lambda: Leaving syncSubscriberVerifications()");
    return;
  }

  let error = await updateVerificationStatus(db, verificationAttributeData.verificationAttributes);
  if (error)
  {
    console.log("updateVerficationStatusError()");
    console.log("Lambda: Leaving syncSubscriberVerifications()");
    return;
  }

  console.log("Lambda: Leaving syncSubscriberVerifications()");

  return;
};
