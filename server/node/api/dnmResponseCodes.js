"use strict";

const RESPONSE =
{
  OK :
  {
    statusCode : 200,
    message: "Message",
  },
  OK_PAYLOAD :
  {
    statusCode : 201,
    message: [],
  },
  OK_UPDATE_PHONE :
  {
    statusCode : 202,
    message: "Your phone has been successfully updated",
  },
  OK_EMAIL_NUGGET :
  {
    statusCode : 203,
    message: "Successfully emailed the nugget(s)",
  },
  OK_EMAIL_VERIFY :
  {
    statusCode : 204,
    message: "Please open the email we sent you and click on the link, to complete your subscription.",
  },
  OK_UPDATE_PREFERENCES :
  {
    statusCode : 206,
    message: "Your delivery preferences have been updated.",
  },
  OK_SYNCHRONIZE_SUBSCRIBERS :
  {
    statusCode : 207,
    message: "Successfully Synchronized Subscribers.",
  },

  ERROR_DUPLICATE_SUBSCRIPTION :
  {
    statusCode : 301,
    message : "A subscription with this email already exists."
  },
  ERROR_NOT_REGISTERED :
  {
    statusCode : 302,
    message: "Nuggeteer not registered.",
  },
  ERROR_EMAIL_MISSING :
  {
    statusCode : 303,
    message : "Email missing from event."
  },
  ERROR_SUBSCRIPTION_EMAIL_MISSING :
  {
    statusCode : 305,
    message : "Email missing from subscribe user event."
  },
  ERROR_PHONE_MISSING :
  {
    statusCode : 306,
    message : "Phone missing from event."
  },
  ERROR_DELIVERY_METHOD_MISSING :
  {
    statusCode : 307,
    message : "Delivery Method missing from event."
  },
  ERROR_DELIVERY_FREQUENCY_MISSING :
  {
    statusCode : 308,
    message : "Delivery Frequency missing from event."
  },
  ERROR_DUPLICATE_REGISTRATION:
  {
    statusCode : 309,
    message : "A member with this email already exists."
  },
  ERROR_USER_POOL_ID_MISSING:
  {
    statusCode : 310,
    message : "User pool id missing from event."
  },
  ERROR_USER_NAME_MISSING:
  {
    statusCode : 311,
    message : "User name missing from event."
  },

  ERROR_GENERAL :
  {
    statusCode : 400,
    message: "Something went wrong. Please try again."
  },
  ERROR_UPDATE_PHONE_FAILED :
  {
    statusCode : 403,
    message: "Update phone number failed.",
  },
  ERROR_UNBLESSED_EMAIL_SOURCE :
  {
    statusCode : 404,
    message: 'Email source not recognized.'
  },
  ERROR_SYNCHRONIZE_SUBSCRIBERS :
  {
    statusCode : 406,
    message: "An Error Occurred While Synchronizing Subscribers."
  },
  ERROR_VERIFICATION_EMAIL_SEND :
  {
    statusCode : 407,
    message: 'Something went wrong while sending verification email.'
  },
  ERROR_DATABASE_GET_ITEM:
  {
    statusCode : 408,
    message : "Database error: GET."
  },
  ERROR_DATABASE_UPDATE_ITEM:
  {
    statusCode : 409,
    message : "Database error: UPDATE."
  },
  ERROR_DATABASE_DELETE_ITEM:
  {
    statusCode : 410,
    message : "Database error: DELETE."
  },
  ERROR_DATABASE_SCAN:
  {
    statusCode : 411,
    message : "Database error: SCAN."
  },
  ERROR_DATABASE_SES:
  {
    statusCode : 412,
    message : "SES error."
  },
  ERROR_S3_GET_OBJECT:
  {
    statusCode : 413,
    message : "S3 getObject error."
  },
  GET_RANDOM_NUGGGET :
  {
    statusCode : 414,
    message : "Cannot retrieve random nugget."
  },
  ERROR_COGNITO_DELETE_USER:
  {
    statusCode : 415,
    message : "Cannot delete Cognito user."
  },
};

module.exports.RESPONSE = RESPONSE;
