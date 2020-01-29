"use strict";

const RESPONSE          = require("./dnmResponseCodes.js").RESPONSE;
const deleteCognitoUser = require("./dnmDeleteCognitoUser.js").deleteCognitoUser;

exports.handler = async (event, context) =>
{
  console.log("Entering Lambda: deleteCognitoUser()");
 
  if(!event.body.userPoolId)
  {
    console.log("Lambda: deleteCognitoUser(): deleteCognitoUser() error: User pool id missing");
    console.log("Leaving Lambda: deleteCognitoUser()");
    return(RESPONSE.ERROR_USER_POOL_ID_MISSING);
  }
 
  if(!event.body.userName)
  {
    console.log("Lambda: deleteCognitoUser(): deleteCognitoUser() error: User name missing");
    console.log("Leaving Lambda: deleteCognitoUser()");
    return(RESPONSE.ERROR_USER_NAME_MISSING);
  }

  let error = await deleteCognitoUser(event.body.userPoolId, event.body.userName); 
	if (error)
  {
    console.log("Lambda: deleteCognitoUser(): deleteCognitoUser() error: ", error);
    console.log("Leaving Lambda: deleteCognitoUser()");
    return(RESPONSE.ERROR_COGNITO_DELETE_USER);
  }
  else
  {
    console.log("Leaving Lambda: deleteCognitoUser()");
    return(RESPONSE.OK);
  }
};
