const AWS = require("aws-sdk");

exports.deleteCognitoUser = async function(userPoolId, userName)
{
  console.log("deleteCognitoUser(): Entering deleteCognitoUser()");

	const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
        apiVersion: "2016-04-18",
        region:     "us-east-1"
	});

	const params =
	{
    UserPoolId: userPoolId,
    Username:		userName,
	};

  let deleteCognitoUserPromise = cognitoIdentityServiceProvider.adminDeleteUser(params).promise();

  try
  {
    let deleteCognitoUserData = await deleteCognitoUserPromise;
    console.log ("deleteCognitoUser(): deleteCognitoUserData = ", deleteCognitoUserData);
    console.log("Leaving deleteCognitoUser()");
    return(false);
  }
  catch(deleteError)
	{
    console.log("deleteCognitoUser(): deleteCognitoUser() error:", deleteError);
    console.log("Leaving deleteCognitoUser()");
    return(true);
	}
};

