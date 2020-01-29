/****************Define Some Constants***************************/
/* We are defining these globally because their values may need */
/* to be changed based on the hosting environment.              */
/****************************************************************/

"use strict";

/* TODO: Use returns wherever possible. */

const NUM_RANDOM_NUGGETS    = 3;

// TODO: Should get region from getSeverlessOutputsGetClient()
const REGION                = "us-east-1";

/*
const USER_POOL_ID          = 'us-east-1_yr0dm0sbu';
const CLIENT_ID             = '7rldk77i2044e05jl4501cicqn';
*/

/*
 * TODO: Research this:
 * AWSCognito.config.region = "us-east-1";
 * AWS.config.update({
*/

AWSCognito.config.update(
  {
    region: REGION
  }
);


let userPool;
let userPoolId;
let USERPOOL_ID;

const getServerlessOutputsGetClient = apigClientFactory.newClient();

getServerlessOutputsGetClient.getServerlessOutputsGet()
  .then(function(data)
  {
    let statusCodeType = getStatusCodeType(data.data.statusCode);

    console.log("data.data.statusCode = ", data.data.statusCode);
    console.log("data.data.message[0] = ", data.data.message[0]);

    if (statusCodeType !== STATUS_CODE_SUCCESS)
    {
      console.log("getServerlessOutputsPost(): Error.");
//      displayAlert(data.data.message, "", "");
      return;
    }
    
    const userPoolClientId  = data.data.message[0].userPoolClientId;
    const identityPoolId    = data.data.message[0].identityPoolId;
    userPoolId    					= data.data.message[0].userPoolId;

    console.log("userPoolId = ", userPoolId);

    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials(
    {
      IdentityPoolId: identityPoolId
    });

//  Need to provide placeholder keys unless unauthorised user access is enabled for user pool
    AWSCognito.config.update({accessKeyId: "anything", secretAccessKey: "anything"});

    const userPoolData =
    {
      UserPoolId: userPoolId,
      ClientId:   userPoolClientId
    };

    console.log("userPooldData.UserPoolId = ", userPoolData.UserPoolId);
    console.log("userPooldData.UserPoolClientId = ", userPoolData.ClientId);

		/* Globals used in Cognito SDK calls. */

    userPool      = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(userPoolData);
    USERPOOL_ID   = 'cognito-idp.'+REGION+'.amazonaws.com/'+userPoolId;


    console.log("userPool = ", userPool);
  });

/*
export const IDENTITY_POOL_ID = 'us-east-1:65bd1e7d-546c-4f8c-b1bc-9e3e571cfaa7'
*/
/****************************************************************/
/*
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId:
    "us-east-1:90d8ce8f-a849-44d2-bf49-a5cbdee9c88b",
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_dQ5bd5XL0":
      JSON.parse(localStorage.getItem("token")) 
    }
});
*/

/****************************************************************/

/****************************************************************/

// [**&**] At some point try removing the following call.  The script is the
// last thing on the web pages so the doc should be ready when it starts
// executing the JS.

$(document).ready(function()
{
  let userAccountState = sessionStorage.getItem("userAccountState");

  setupIndexPageEventHandlers();

  if (userAccountState === "loggedIn")
  {
    viewDisplayLoggedInState();
  }
  else if
  (userAccountState === 'registered')
  {
    viewDisplayRegisteredState();
  }
  else
  {
    viewDisplayLoggedOutState();
  }
  postNuggetOfTheDay(); 
});

/****************************************************************/
/****************************************************************/

function dnSetClickEventHandler(elementId, handler)
{
  const element = document.getElementById(elementId);
  element.addEventListener("click", handler, false);
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function setupIndexPageEventHandlers()
{
  dnSetClickEventHandler("display_random_nugget_button-id", postRandomNugget);

  dnSetClickEventHandler("navbar-nugget-of-day-preferences-item-id", postNuggetOfTheDay);

  /* Events having to do with the login process. */

	dnSetClickEventHandler("modal-lr-pan8-login-link-id", viewDisplayLoginUserPane);
	dnSetClickEventHandler("navbar-log-in-out-item-id", signInOrOutUser);
	dnSetClickEventHandler("modal-lr-pan7-login-button-id", loginUser);

  /* Events having to do with the subscribe process. */

  dnSetClickEventHandler("subscribe-button-id", subsribeUser);

  /* Events having to do with the registration process */

	dnSetClickEventHandler("modal-lr-pan7-signup-link-id", viewDisplaySignUpUserPane);
	dnSetClickEventHandler("navbar-registration-item-id", viewDisplaySignUpUserPane);
  dnSetClickEventHandler("join-button-id", viewDisplaySignUpUserPane);
	dnSetClickEventHandler("modal-lr-pan8-signup-button-id", registerNuggeteer);
	dnSetClickEventHandler("modal-verify-registration-submit-button-id", verifyRegistration);
	dnSetClickEventHandler("modal-verify-registration-resend-pin-button-id", resetVerificationPIN);
	dnSetClickEventHandler("modal-verify-registration-close-button-id", onVerificationIncomplete);

  /* Events having to do with user passwords. */

	dnSetClickEventHandler("modal-lr-pan7-password-link-id", viewDisplayResetPasswordModal);
	dnSetClickEventHandler("modal-reset-password-submit-button-id", resetPassword);
	dnSetClickEventHandler("modal-confirm-reset-password-submit-button-id", confirmResetPassword);

  /* Events having to do with deleting accounts. */

	dnSetClickEventHandler("footer-delete-account-link-id", viewDisplayDeleteAccountModal);
	dnSetClickEventHandler("modal-delete-account-confirm-button-id", deleteAccount);
	dnSetClickEventHandler("footer-unsubscribe-link-id", viewDisplayUnsubscribeModal);
	dnSetClickEventHandler("modal-unsubscribe-submit-button-id", unsubscribeUser);
	dnSetClickEventHandler("navbar-preferences-item-id", displayDeliveryPreferencesModal);
	dnSetClickEventHandler("modal-preferences-submit-button-id", updateDeliveryPreferences);
	dnSetClickEventHandler("modal-preferences-password-link-id", viewDisplayChangePasswordModal);
	dnSetClickEventHandler("modal-preferences-phone-link-id", viewDisplayChangeUserPhoneModal);
	dnSetClickEventHandler("modal-change-password-submit-button-id", changePassword);
	dnSetClickEventHandler("modal-change-phone-submit-button-id", changeUserPhone);
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function postNuggetOfTheDay()
{
  console.log("Entering postNuggetOfTheDay()");

  const client = apigClientFactory.newClient();

  client.nuggetOfDayGet()
    .then(function(data)
    {
      console.log("postNuggetOfTheDay(): data = ", JSON.stringify(data));
      console.log("postNuggetOfTheDay(): data.data.message[0] = ", JSON.stringify(data.data.message[0]));
      console.log("postNuggetOfTheDay(): data.data.message[0].quote = ", JSON.stringify(data.data.message[0].quote));
      viewDisplayNuggetOfTheDay(data.data.message[0]);
    });

  console.log("Leaving postNuggetOfTheDay()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayNuggetOfTheDay(nugget)
{
  console.log("Entering viewDisplayNuggetOfTheDay()");

  /*
  * The Boostrap HTML displays one of the two display areas depending on the size of the
  * window.
  */

  const nuggetDisplayArea_1 = document.getElementById("nugget-of-day-display-area-1-id");
  nuggetDisplayArea_1.innerHTML = nugget.quote + "<br>" + nugget.author;

  const nuggetDisplayArea_2 = document.getElementById("nugget-of-day-display-area-2-id");
  nuggetDisplayArea_2.innerHTML = nugget.quote + "<br>" + nugget.author;

  console.log("Leaving viewDisplayNuggetOfTheDay()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

/* TODO: Process error message from Lambda. */

function postRandomNugget(event)
{
  event.preventDefault();

  console.log("Entering postRandomNugget()");

  const client = apigClientFactory.newClient();

  for (let randomNuggetIndex = 1; randomNuggetIndex <= NUM_RANDOM_NUGGETS; randomNuggetIndex++)
  {
    client.randomNuggetGet()
      .then(function(data)
      {
        console.log("postRandomNugget(): data", data);
        console.log("postRandomNugget(): data.data.", data.data);
        console.log("postRandomNugget(): data.data.message[0]", data.data.message[0]);
        viewDisplayRandomNugget(data.data.message[0], randomNuggetIndex);
      });
  }

  console.log("Leaving postRandomNugget()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

/* TODO: Process error message from Lambda. */

function viewDisplayRandomNugget(nuggetData, nuggetIndex)
{
  console.log("Entering viewDisplayRandomNugget()");

  const nuggetDisplayArea = document.getElementById("nuggets-display-area-" + nuggetIndex + "-id");
  nuggetDisplayArea.innerHTML = nuggetData.nugget + "<br>" + nuggetData.author;

  const topicDisplayArea = document.getElementById("topic-display-area-" + nuggetIndex + "-id");
  topicDisplayArea.innerHTML = nuggetData.topic;

  console.log("Leaving viewDisplayRandomNugget()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewGetSubscribeEmail()
{
  console.log("Entering viewGetSubscribeEmail()");

	let email = document.getElementById("subscribe-user-email-input-id").value;

//  email = email.toLowerCase();

	if (!emailIsValid(email))
	{
    displayAlert("Invalid email format", "subscribe-status-bar-id", "viewGetSubscribeEmail");
    console.log("Error: Leaving viewGetSubscribeEmail()");
		return(false);
	}

  console.log("Leaving viewGetSubscribeEmail()");
  return(email);
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplaySubscribeSuccessModal()
{
  console.log("Entering viewDisplaySubscribeSuccessModal()");

  $("#subscribe-success-modal-id").modal();

  console.log("Leaving viewDisplaySubscribeSuccessModal()");
}

/****************************************************************/
/****************************************************************/

const STATUS_CODE_SUCCESS       = 2;
const STATUS_CODE_CLIENT_ERROR  = 3;
const STATUS_CODE_SERVER_ERROR  = 4;

function getStatusCodeType(statusCode)
{
  let firstDigit = Number((statusCode).toString().slice(0,1));

  if (firstDigit === 2)
  {
    return (STATUS_CODE_SUCCESS);
  }

  if (firstDigit === 3)
  {
    return (STATUS_CODE_CLIENT_ERROR);
  }

  if (firstDigit === 4)
  {
    return (STATUS_CODE_SERVER_ERROR);
  }
}

/****************************************************************/
/****************************************************************/

function addUserToSubscribers(email)
{
  console.log("Entering addUserToSubscribers()");
 
  const client = apigClientFactory.newClient();

  client.addSubscriberPost({}, {email:email}, {})
    .then(function(data)
    {
      /* If the first digit of the returned errorCode is a
       * 2 then the call was successful.
      */

      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType === STATUS_CODE_SUCCESS)
      {
        viewDisplaySubscribeSuccessModal();
      }
      else
      {
        displayAlert(data.data.message, "subscribe-status-bar-id", "subscribeUser");
      }
    });

  console.log("Leaving addUserToSubscribers()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function subsribeUser(event)
{
  event.preventDefault();

  console.log("Entering subsribeUser()");

	const email = viewGetSubscribeEmail();
	if (!email)
	{
    console.log("Error: Leaving subsribeUser()");
		return;
	}

  const client = apigClientFactory.newClient();

  client.getNuggeteerPost({}, {email:email}, {})
    .then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      /* If getNuggeteerPost returns success then a Nuggeteer with
       * the email has been found - so we raise a user already
       * exits error.
      */
      if (statusCodeType === STATUS_CODE_SUCCESS)
      {
        displayAlert("User with that email is already registered.", "subscribe-status-bar-id", "subscribeUser");
        console.log("Error: Leaving subsribeUser()");
        return;
      }

      /* If a client error is returned that means that we did
       * not find user with the email.  If it is not a client
       * error then it is a server error which is an actual
       * issue.
      */
      if(statusCodeType !== STATUS_CODE_CLIENT_ERROR)
      {
        displayAlert(data.data.message, "subscribe-status-bar-id", "subscribeUser");
        console.log("Error: Leaving subsribeUser()");
        return;
      }

      addUserToSubscribers(email);
    });

  console.log("Leaving subsribeUser()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function deleteCurrentSubscription(email)
{
  console.log("Entering deleteCurrentSubscription()");

  const client = apigClientFactory.newClient();

  client.deleteSubscriberPost({}, {email:email}, {})
    .then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType !== STATUS_CODE_SUCCESS)
      {
        displayAlert(data.data.message, "modal-lr-pan8-status-bar-id", "deleteCurrentSubscription:deleteSubscriberPost()");
        return;
      }
    });

  console.log("Leaving deleteCurrentSubscription()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/* Functions having to do with user registration         */
/****************************************************************/

/****************************************************************/
/****************************************************************/

/*
 * TODO: Group UI only functions together.
*/

function viewDisplaySignUpUserPane(event)
{
  event.preventDefault();

  console.log("Entering viewDisplaySignUpUserPane()");

  $("#lr-modal-id").modal();

  /* && */

	$('#lr-modal-nav-tabs-id a[href="#panel8"]').tab('show');

  console.log("Exiting viewDisplaySignUpUserPane()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewGetRegistrationData()
{
  console.log("Entering viewGetRegistrationData()");

  let phone               = null;
	phone                   = document.getElementById("modal-lr-pan8-phone-input-id").value;
	const email             = document.getElementById("modal-lr-pan8-email-input-id").value;
	const password          = document.getElementById("modal-lr-pan8-password-input-id").value;
	const repeatPassword    = document.getElementById("modal-lr-pan8-repeatpassword-input-id").value;

	if(!(email && password && repeatPassword))
	{
    displayAlert("The email and both password fields are required.", "modal-lr-pan8-status-bar-id", "viewGetRegistrationElemennts");
    console.log("Error: Leaving viewGetRegistrationData()");
    return(false);
  }

  if(password !== repeatPassword)
  {
    displayAlert("Passwords must match.", "modal-lr-pan8-status-bar-id", "viewGetRegistrationElemennts");
    console.log("Error: Leaving viewGetRegistrationData()");
    return(false);
  }

	if (!emailIsValid(email))
	{
    displayAlert("Invalid email format.", "modal-lr-pan8-status-bar-id", "viewGetRegistrationElemennts");
    console.log("Error: Leaving viewGetRegistrationData()");
		return(false);
	}

  if (phone)
  {
		if (!phoneIsValid(phone))
		{
      displayAlert("Invalid phone format.", "modal-lr-pan8-status-bar-id", "viewGetRegistrationElemennts");
      console.log("Error: Leaving viewGetRegistrationData()");
			return(false);
		}
  }

  sessionStorage.setItem('userEmail', email);

  console.log("Leaving viewGetRegistrationData()");

  return({email:email, password:password, phone:phone});
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayVerifyRegistrationModal()
{
  console.log("Entering viewDisplayVerifyRegistrationModal()");

  $('#lr-modal-id').modal('hide');
  $("#verify-registration-modal-id").modal(({backdrop: 'static', keyboard: false}));

  console.log("Leaving viewDisplayVerifyRegistrationModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function addPhoneToAttributeList(phone)
{
  let attributeList = [];

  const newPhone = "+1" + phone;

  const dataPhoneNumber =
  {
    Name : 'phone_number',
    Value : newPhone
  };

  console.log("Entering addPhoneToAttributeList()");

  const attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

  attributeList.push(attributePhoneNumber);

  console.log("Leaving addPhoneToAttributeList()");

  return(attributeList);
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function userPoolSignup(registrationData)
{
  let attributeList = [];

  console.log("Entering userPoolSignup()");

  if (registrationData.phone)
  {
    attributeList = addPhoneToAttributeList(registrationData.phone);
  }

  userPool.signUp(registrationData.email, registrationData.password, attributeList, null, function(err, result)
  {
    if (err)
    {
      /*
       * TODO: Is the following modal still visible so it can display the alert?
      */
      displayAlert(err, "modal-lr-pan8-status-bar-id", "registerNuggeteer:userPool.signUp()");

      /* Since UserPool.signup is asynchrous it is possible that a user is added to the 
       * Nuggeteer table before UserPool.signup returns a failure message.  So we call 
       * rollbackRegistration() even it is possible that the user is yet to be added to the Nuggeteer
       * table - just to be save.
      */
      rollbackRegistration();

      console.log("Error: Leaving userPoolSignup()");

      return;
    }

    let cognitoUser = result.user;
		let userName		= cognitoUser.getUsername();
    console.log('user name is ' + cognitoUser.getUsername());

    sessionStorage.setItem("userName", userName);

    viewDisplayVerifyRegistrationModal();
  });

  console.log("Leaving userPoolSignup()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function deleteCognitoUser()
{
  console.log("Entering deleteCognitoUser()");

  const userName	= sessionStorage.getItem("userName");

  const client = apigClientFactory.newClient();

  client.deleteCognitoUserPost({}, {userPoolId:userPoolId, userName:userName}, {})
    .then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType !== STATUS_CODE_SUCCESS)
      {
        console.log("Error when rolling back Cognito user.");
        console.log("Error: Leaving deleteCognitoUser()");
        return;
      }
    });

  console.log("Leaving deleteCognitoUser()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function getRegistrationVerificationData()
{
  console.log("Entering getRegistrationVerificationData()");

  const email = sessionStorage.getItem('userEmail');
	const pin   = document.getElementById("modal-verify-registration-pin-input-id").value;

	if (!pinIsValid(pin))
  {
    console.log("getRegistrationVerificationData(): Error invalid pin");
    displayAlert("PIN must be 6 numeric characters.", "modal-verify-registration-status-bar-id", "getRegistrationVerificationData");
    return(false);
  }

  console.log("Leaving getRegistrationVerificationData()");

  return({email:email, pin:pin});
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayRegistrationSuccessModal()
{
  console.log("Entering viewDisplayRegistrationSuccessModal()");
  
  $("#verify-registration-modal-id").modal('hide');

  $("#registration-success-modal-id").modal();

  console.log("Exiting viewDisplayRegistrationSuccessModal()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

/*
 * New registration consists of three separate processes:
 *  1) Add the user to the Nuggateer DynamoDb table.
 *  2) Sign the user up in a Cognito User Pool.
 *  3) Delete susbscrition if the same email has been use
 *     to subscribe to the daily nugget.
 * Note the following;
 *  1) All three of these operations are asynchronous.
 *     1 and 3 are implemented as promises.  2 is
 *     is handled by a callback.
 *  2) If 1 fails, the other two operations will not
 *     be run.
 *  3) If 1 succeeds both of the other operations will
 *     be run.  If the subscription does not get deleted
 *     it should not really pose any problems.  If Cognito
 *     User Pool signup fails and the subscription 
 *     gets deleted, it should also not be a major issue.
 *  4) The time the system will end up in a "bad" state
 *     is 1 succeeds and 2 fails.  At this point the
 *     changes made in 1 are not rolled back.  So, it
 *     would lead ot a situaion where the user has an
 *     entry in the Nuggeteer database and will receive
 *     Nuggets (based on the default preferences), but
 *     he will not be able to login.  By not being able
 *     to login he will not be able to modify his
 *     preferences or delete his account, among other
 *     things.
 * So, at some point need to address this situation.
 * One option is to make the user pool signup the first
 * operation and then upon login check whether the user
 * has a corresponding entry in the Nuggeteer table.
 * If there no entry then create one before completing
 * the logon procss.
*/

function registerNuggeteer(event)
{
  event.preventDefault();

  console.log("Entering registerNuggeteer()");

	const registrationData = viewGetRegistrationData();
	if (!registrationData)
	{
		return;
	}

  userPoolSignup(registrationData);

  const client = apigClientFactory.newClient();
  client.registerNuggeteerPost({}, {email:registrationData.email, phone:registrationData.phone}, {})
    .then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType !== STATUS_CODE_SUCCESS)
      {
        /* The user may have already been added to Cognito so we call
         * rollbackRegistration() just to be save.
        */
        rollbackRegistration();

        displayAlert(data.data.message, "modal-lr-pan8-status-bar-id", "registerNuggeteer:registerNuggeteerPost()");

        console.log("Error: Leaving registerNuggeteer()");

        return;
      }

    /* We are not going to worry about deleteCurrentSubscription failing.
     * Worst case the member get an extra Nugget of the Day.
     * TODO: Develop Lambda to periodically check if there are any member
     * duplicates in the subscriber table and clean them up.
    */

      deleteCurrentSubscription(registrationData.email);
    });

  console.log("Leaving registerNuggeteer()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function rollbackRegistration()
{
  console.log("Entering rollbackRegistration()");

  deleteCognitoUser();
  deleteNuggeteer();
  setSessionStateSignedOut();

  console.log("Leaving rollbackCognitoRegistration()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

/* The onVerificationIncomplete() gets called if the user closes
 * the verify registration modal (clicks the x in the top righthand
 * corner of the window).  This is not really an error, but we set the
 * callFailure global to true so that the registerNuggeteer() fucntion
 * deletes the unconfirmed user from the Cognito user pool.
*/

function onVerificationIncomplete(event)
{
  event.preventDefault();

  console.log("Entering onVerificationIncomplete()");

  rollbackRegistration();

  console.log("Leaving onVerificationIncomplete()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function verifyRegistration(event)
{
  event.preventDefault();

  console.log("Entering verifyRegistration()");

  const registrationVerificationData = getRegistrationVerificationData();
  if (registrationVerificationData === false)
  {
    return;
  }

  console.log("verifyRegistration(): Username = ", registrationVerificationData.email);
  console.log("verifyRegistration(): Pin = ", registrationVerificationData.pin);
  console.log("verifyRegistration(): userPool = ", userPool);

  const userData =
	{
		Username: 	registrationVerificationData.email,
		Pool: 			userPool
  };

	const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

	cognitoUser.confirmRegistration(registrationVerificationData.pin, true, function(err, result)
  {
		if (err)
		{
//      deleteCognitoUser();
//      deleteNuggeteer();
      displayAlert(err, "modal-verify-registration-status-bar-id", "verifyRegistration");
      console.log("Error: Leaving verifyRegistration()");
			return;
		}

    /* TODO: 
    *  confirmNuggeteer();
    */

    sessionStorage.setItem("userAccountState", "registered");

    viewDisplayRegistrationSuccessModal();

    viewDisplayRegisteredState();
  });

  console.log("Leaving verifyRegistration()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function resetVerificationPIN(event)
{
  event.preventDefault();

  console.log("Entering resetVerificationPIN()");

  const email = sessionStorage.getItem('userEmail');

  const userData =
	{
		Username: email,
		Pool: userPool
  };

  console.log("resetVerificationPIN(): Username = ", email);
  console.log("resetVerificationPIN(): userPool = ", userPool);

  const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

  cognitoUser.resendConfirmationCode(function(err, result)
  {
    if (err)
    {
      displayAlert(err, "modal-verify-registration-status-bar-id", "resetVerificationPIN");
      regCallFailureUser = true;
      console.log("Error: Leaving resetVerificationPIN()");
      return;
    }

    /* Note: The funciton being called hides a modal.  This current
     * function only displayed teh reg modal.  Don't think the hide
     * will hurt anything - so I can reuse the function.
     *  $("#verify-registration-modal-id").modal();
    */

    viewDisplayVerifyRegistrationModal();
  });

  console.log("Leaving resetVerificationPIN()");

  return;
}

/****************************************************************/
/* End of functions having to do with user registration         */
/****************************************************************/

/****************************************************************/
/* Functions having to do with user login/logout                */
/****************************************************************/

function viewDisplayLoginUserPane()
{
  console.log("Entering viewDisplayLoginUserPane()");

  $("#lr-modal-id").modal("show");

	$('#lr-modal-nav-tabs-id a[href="#panel7"]').tab('show');
  
  console.log("Leaving viewDisplayLoginUserPane()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function signInOrOutUser(event)
{
  event.preventDefault();

  console.log("Entering signInOrOutUser()");

  console.log("event.type = ", event.type);
  console.log("event.target = ", event.target);

  const userAccountState = sessionStorage.getItem("userAccountState");

  if (userAccountState === "loggedIn")
  {
    console.log("signInOrOutUser(): userAccountState = loggedIn");
    signOutUser(); 
  }
  else
  {
    console.log("signInOrOutUser(): userAccountState = not loggedIn");
    viewDisplayLoginUserPane();
  }

  console.log("Leaving signInOrOutUser()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewGetAuthenticationData()
{
  console.log("Entering viewGetAuthenticationData()");

	const email       = document.getElementById("modal-lr-pan7-email-input-id").value;
	const password    = document.getElementById("modal-lr-pan7-password-input-id").value;

  console.log("Leaving viewGetAuthenticationData()");

  return({Username:email, Password:password});
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function setSessionStateLoggedIn(idToken, email, accessToken)
{
  console.log("Entering setSessionStateLoggedIn()");

  /* Use the idToken for Logins Map when Federating User Pools
    * with identity pools or when passing through an Authorization
    * Header to an API Gateway Authorizer.
  */

  sessionStorage.setItem('idToken', idToken);
  sessionStorage.setItem('userEmail', email);
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('userAccountState', "loggedIn");

  console.log("Leaving setSessionStateLoggedIn()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayLoginSuccessModalState()
{
  console.log("Entering viewDisplayLoginSuccessModalState()");

  $("#lr-modal-id").modal("hide");
  $("#login-success-modal-id").modal("show");

  console.log("Leaving viewDisplayLoginSuccessModalState()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function loginUser()
{
  console.log("Entering loginUser()");

  const authenticationData = viewGetAuthenticationData();

  const userData =
  {
    Username  : authenticationData.Username,
    Pool      : userPool
  };

  const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

  const authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

  cognitoUser.authenticateUser(authenticationDetails,
  {
    onSuccess: function (result)
    {
      const accessToken   = result.getAccessToken().getJwtToken();
      const idToken       = result.idToken.jwtToken;

      setSessionStateLoggedIn(idToken, authenticationData.Username, accessToken);

      viewDisplayLoginSuccessModalState();

      viewDisplayLoggedInState();

      /*
       * TODO: Rearch style.visibility vs innerHTML vs style.display.
       * TODO: Should I be using style visibility instead of innerHTML to hide text.
       * TODO: Check and see if the following should be used instead of style.visibility
       *       document.getElementById("myDIV").style.display = "none";
      */
    },
    onFailure: function(err)
    {
      if (err)
      {
        displayAlert(err, "modal-lr-pan7-status-bar-id", "loginUser");
        console.log("Error: Leaving loginUser()");
        return;
      }
    },
  });

  console.log("Leaving loginUser()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function setSessionStateSignedOut()
{
  console.log("Entering setSessionStateSignedOut()");

  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userAccountState');
  sessionStorage.setItem("userAccountState", "loggedOut");

  console.log("Leaving setSessionStateSignedOut()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplaySignOutModalState()
{
  console.log("Entering viewDisplaySignOutModalState()");

  $('#logoff-success-modal-id').modal();

  console.log("Leaving viewDisplaySignOutModalState()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

/*
The following signs the current user out from the application,
but tokens remain valid.
*/

function signOutUser()
{
  console.log("Entering signOutUser()");

  const email = sessionStorage.getItem('userEmail');

  var userData =
  {
    Username  : email,
    Pool      : userPool
  };

  const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
  if (cognitoUser != null)
	{
    cognitoUser.signOut();

    setSessionStateSignedOut();

    viewDisplaySignOutModalState();

    viewDisplayLoggedOutState();

  }

  console.log("Leaving signOutUser()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function setSessionStateGlobalSignedOut()
{
  console.log("Entering setSessionStateGlobalSignedOut()");

  localStorage.clear(); 
  sessionStorage.clear(); 

  console.log("Leaving setSessionStateGlobalSignedOut()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

/*
The following example signs the current user out globally by
invalidating all issued tokens.
*/

function signOutUserGlobally(event)
{
  event.preventDefault();

  console.log("Entering signOutUserGlobally()");

  const email = sessionStorage.getItem('userEmail');

  var userData =
  {
    Username  : email,
    Pool      : userPool
  };

  const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

  if (cognitoUser != null)
	{
    cognitoUser.globalSignOut();

    setSessionStateGlobalSignedOut();

    viewDisplayLoggedOutState();

    setSessionStateSignedOut();
	}

  console.log("Leaving signOutUserGlobally()");
}

/****************************************************************/
/* End of functions having to do with user login/logout         */
/****************************************************************/

/****************************************************************/
/* Functions having to do with user reset password              */
/****************************************************************/

function viewDisplayResetPasswordModal(event)
{
  event.preventDefault();

  console.log("Entering viewDisplayResetPasswordModal()");

  $("#lr-modal-id").modal("hide");

  $("#reset-password-modal-id").modal();

  console.log("Leaving viewDisplayResetPasswordModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewGetResetPasswordEmail()
{
  console.log("Entering viewGetResetPasswordEmail()");

  let email = document.getElementById("modal-reset-password-email-input-id").value;

	if (!emailIsValid(email))
	{
    displayAlert("Invalid email format", "modal-reset-password-status-bar-id", "viewGetResetPasswordEmail");
    console.log("Error: Leaving viewGetSubscribeEmail()");
		return(false);
	}

  console.log("Leaving viewGetResetPasswordEmail()");

  return(email);
}

/****************************************************************/
/****************************************************************/

function viewDisplayConfirmResetPasswordModal()
{
  console.log("Entering viewDisplayConfirmResetPasswordModal()");

  /*
  $("#reset-password-modal-id").modal("hide");
  */
  $("#confirm-reset-password-modal-id").modal();

  console.log("Leaving viewDisplayConfirmResetPasswordModal()");
}

/****************************************************************/
/****************************************************************/

function resetPassword(event)
{
  event.preventDefault();

  console.log("Entering resetPassword()");

  let email = viewGetResetPasswordEmail();
  if (!email)
  {
    console.log("Error: Leaving resetPassword()");
    return;
  }

  $("#reset-password-modal-id").modal("hide");

  sessionStorage.setItem('userEmail', email);

  var userData =
  {
    Username  : email,
    Pool      : userPool
  };

  const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

  cognitoUser.forgotPassword(
	{
    onSuccess: function (result)
		{
      console.log('call result: ' + result);
    },
    onFailure: function(err)
    {
      if (err)
      {
        displayAlert(err, "modal-reset-password-status-bar-id", "resetPassword");
        console.log("Error: Leaving resetPassword()");
        return;
      }
		},
    inputVerificationCode()
		{
			viewDisplayConfirmResetPasswordModal();
    }
  });

  console.log("Leaving resetPassword()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

  function viewGetResetPasswordConfirmationData()
  {
    console.log("Entering viewGetResetPasswordConfirmationData()");

    const verificationCode  = document.getElementById("modal-confirm-reset-password-pin-input-id").value;
    const newPassword       = document.getElementById("modal-confirm-reset-password-password-input-id").value;

  if(!(verificationCode && newPassword))
	{
    displayAlert("Both the verification and password fields are required.", "modal-confirm-reset-password-status-bar-id", "viewGetResetPasswordConfirmationData");
    console.log("Error: Leaving viewGetRegistrationData()");
    return(false);
  }

    console.log("Leaving viewGetResetPasswordConfirmationData()");

    return({verificationCode:verificationCode, newPassword:newPassword});
  }

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayResetPasswordSuccessModal()
{
  console.log("Entering viewDisplayResetPasswordSuccessModal()");

  $("#password-reset-success-modal-id").modal();

  console.log("Leaving viewDisplayResetPasswordSuccessModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function confirmResetPassword(event)
{
  event.preventDefault();

  console.log("Entering confirmResetPassword()");

  const email = sessionStorage.getItem('userEmail');

  var userData =
  {
    Username  : email,
    Pool      : userPool
  };

  const confirmationData = viewGetResetPasswordConfirmationData();
  if (confirmationData === false)
  {
    return;
  }

  const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

	cognitoUser.confirmPassword(confirmationData.verificationCode, confirmationData.newPassword,
	{
    onFailure(err)
    {
      displayAlert(err, "modal-confirm-reset-password-status-bar-id", "confirmResetPassword");
      console.log("Error: Leaving confirmResetPassword()");
      return;
    },
    onSuccess()
    {
      $("#confirm-reset-password-modal-id").modal("hide");
      viewDisplayResetPasswordSuccessModal();
    },
	});

  console.log("Leaving confirmResetPassword()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayDeleteAccountModal(event)
{
  event.preventDefault();

  console.log("Entering viewDisplayDeleteAccountModal()");

  $("#delete-account-modal-id").modal();

  console.log("Leaving viewDisplayDeleteAccountModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayDeleteAccountSuccessModal()
{
  console.log("Entering viewDisplayDeleteAccountSuccessModal()");

  $("#delete-account-success-modal-id").modal();

  console.log("Leaving viewDisplayDeleteAccountSuccessModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function deleteNuggeteer()
{
  console.log("Entering deleteNuggeteer()");

  const email = sessionStorage.getItem('userEmail');

  const client = apigClientFactory.newClient();

  client.deleteNuggeteerPost({}, {email:email}, {})
    .then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType !== STATUS_CODE_SUCCESS)
      {
        displayAlert(data.data.message, "modal-lr-pan8-status-bar-id", "deleteNuggeteer:deleteNuggeteerPost()");
        console.log("Error: Leaving deleteNuggeteer()");
        return;
      }
    });

  console.log("Leaving deleteNuggeteer()");
}

/****************************************************************/
/****************************************************************/

//NEXT_TODO
/*
 * TODO: Should the deleteNuggeteer fucntionality take place
 * before the Cognito dolete?  Doing it this way means that
 * when a user logs on we can check and see if they have an
 * entry in the Nuggeteer table and if they do not, we can
 * create one.
 *
*/

function deleteAccount(event)
{
  event.preventDefault();

  console.log("Entering deleteAccount()");

  const cognitoUser = userPool.getCurrentUser();

  if (cognitoUser === null)
	{
    console.log("Error: Leaving deleteAccount()");
    return;
  }

  cognitoUser.getSession(function (err, session)
	{
		if (err)
    {
      displayAlert(err, "modal-delete-account-status-bar-id", "deleteAccount");
      console.log("Error: Leaving deleteAccount()");
      return;
    }

		cognitoUser.deleteUser(function(err, result)
		{
      if (err)
			{
        displayAlert(err, "modal-delete-account-status-bar-id", "deleteAccount");
        console.log("Error: Leaving deleteAccount()");
				return;
			}

      deleteNuggeteer();

      localStorage.clear(); 
      sessionStorage.clear(); 

      viewDisplayDeleteAccountSuccessModal();

      viewDisplayLoggedOutState();
		});
  });

  console.log("Leaving deleteAccount()");

  return;
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayUnsubscribeModal(event)
{
  event.preventDefault();

  console.log("Entering viewDisplayUnsubscribeModal()");

  $("#unsubscribe-modal-id").modal();

  console.log("Leaving viewDisplayUnsubscribeModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayUnsubscribeSuccessModal()
{
  console.log("Entering viewDisplayUnsubscribeSuccessModal()");

  $("#unsubscribe-success-modal-id").modal();

  console.log("Leaving viewDisplayUnsubscribeSuccessModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function unsubscribeUser(event)
{
  event.preventDefault();

  console.log("Entering unsubscribeUser()");

	const email = document.getElementById("modal-unsubscribe-email-input-id").value;

  const client = apigClientFactory.newClient();

  client.deleteSubscriberPost({}, {email:email},  {})
    .then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType !== STATUS_CODE_SUCCESS)
      {
        displayAlert(data.data.message, "modal-unsubscribe-status-bar-id", "unsubscribeUser:deleteSubscriberPost()");
        console.log("Error: Leaving unsubscribeUser()");
        return;
      }

      viewDisplayUnsubscribeSuccessModal();

      viewDisplayLoggedOutState();
    });

  console.log("Leaving unsubscribeUser()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayChangePasswordModal(event)
{
  event.preventDefault();

  console.log("Entering viewDisplayChangePasswordModal()");

  $("#preferences-modal-id").modal("hide");

  $("#change-password-modal-id").modal();

  console.log("Leaving viewDisplayChangePasswordModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewGetChangePasswordData()
{
  console.log("Entering viewGetChangePasswordData()");

	const oldPassword         = document.getElementById("modal-change-password-current-password-input-id").value;
	const newPassword         = document.getElementById("modal-change-password-new-password-input-id").value;
	const repeatNewPassword   = document.getElementById("modal-change-password-repeatpassword-input-id").value;

	if(!(oldPassword && newPassword && repeatNewPassword))
	{
    displayAlert("All fields must be completed.", "modal-change-password-status-bar-id", "changePassword");
    console.log("Error: Leaving viewGetChangePasswordData()");
    return(false);
  }

  if(newPassword !== repeatNewPassword)
  {
    displayAlert("New passwords must match.", "modal-change-password-status-bar-id", "changePassword");
    console.log("Error: Leaving viewGetChangePasswordData()");
    return(false);
  }

  console.log("Leaving viewGetChangePasswordData()");

  return({oldPassword:oldPassword, newPassword:newPassword});
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayChangePasswordSuccessModal()
{
  console.log("Entering viewDisplayChangePasswordSuccessModal()");

  $('#change-password-modal-id').modal('hide');

  $("#change-password-success-modal-id").modal();

  console.log("Leaving viewDisplayChangePasswordSuccessModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function changePassword(event)
{
  event.preventDefault();

  console.log("Entering changePassword()");

  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser === null)
  {
    console.log("Error: Leaving changePassword()");
    return;
  }

	const changePasswordData = viewGetChangePasswordData();
	if (!changePasswordData)
	{
    console.log("Error: Leaving changePassword()");
		return;
	}

  cognitoUser.getSession(function (err, session)
  {
    if (err)
    {
      console.log("Error: Leaving changePassword()");
      displayAlert(err, "modal-change-password-status-bar-id", "changePassword");
      return;
    }

    cognitoUser.changePassword(changePasswordData.oldPassword, changePasswordData.newPassword, function(err, result)
    {
      if (err)
      {
        console.log("Error: Leaving changePassword()");
        displayAlert(err, "modal-change-password-status-bar-id", "changePassword");
        return;
      }
      else
      {
        console.log("Error: Leaving changePassword()");
        viewDisplayChangePasswordSuccessModal();
        return;
      }
    });
  });

  console.log("Leaving changePassword()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayChangeUserPhoneModal(event)
{
  event.preventDefault();

  console.log("Entering viewDisplayChangeUserPhoneModal()");

  $("#preferences-modal-id").modal("hide");

  $("#change-phone-modal-id").modal();

  console.log("Leaving viewDisplayChangeUserPhoneModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewGetChangeUserPhoneData()
{
  console.log("Entering viewGetChangeUserPhoneData()");

	const newPhone = document.getElementById("modal-change-phone-new-phone-input-id").value;

	if (!newPhone )
	{
    displayAlert("You must enter a new phone number.", "modal-change-phone-status-bar-id", "changeUserPhone");
    console.log("Error: Leaving viewGetChangeUserPhoneData()");
    return(false);
  }

  console.log("Leaving viewGetChangeUserPhoneData()");

  return(newPhone);
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function updateCognitoUserPhone(Phone)
{
  console.log("Entering updateCognitoUserPhone()");

  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser === null)
  {
    console.log("Error: Leaving updateCognitoUserPhone()");
    return;
  }

  cognitoUser.getSession(function (err, session)
  {
    if (err)
    {
      displayAlert(err, "modal-change-phone-status-bar-id", "changePhone");
      console.log("Error: Leaving updateCognitoUserPhone()");
      return;
    }

    const newPhone = "+1" + Phone;

    const newPhoneAttribute =
    {
      Name: 'phone_number',
      Value: newPhone
    };

    const attribute = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(newPhoneAttribute);

    let attributeList = [];

    attributeList.push(attribute);

    cognitoUser.updateAttributes(attributeList, function(err, result)
    {
      if (err)
      {
        displayAlert(err, "modal-change-phone-status-bar-id", "updateCognitoUserPhone");
        console.log("Error: Leaving updateCognitoUserPhone()");
        return;
      }
    });
  });

  console.log("Leaving updateCognitoUserPhone()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayChangeUserPhoneSuccessModal()
{
  console.log("Entering viewDisplayChangeUserPhoneSuccessModal()");

  $('#change-phone-modal-id').modal('hide');

  $("#change-phone-success-modal-id").modal();

  console.log("Leaving viewDisplayChangeUserPhoneSuccessModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayChangeUserPhoneFailedMessage(errorMessage)
{
  console.log("Entering viewDisplayChangeUserPhoneFailedMessage()");

  $("#change-phone-modal-id").modal("show");

  displayAlert(errorMessage, "modal-change-phone-status-bar-id", "viewDisplayChangeUserPhoneFailedMessage");

  console.log("Leaving viewDisplayChangeUserPhoneFailedMessage()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function changeUserPhone(event)
{
  event.preventDefault();

  console.log("Entering changeUserPhone()");

  const newPhone = viewGetChangeUserPhoneData();

  if (!phoneIsValid(newPhone))
	{
    viewDisplayChangeUserPhoneFailedMessage("Invalid phone format.");
    console.log("Error: Leaving changeUserPhone()");
    return;
  }

  const email = sessionStorage.getItem('userEmail');

  const client = apigClientFactory.newClient();

  client.changeNuggeteerPhonePost({}, {email:email, phone:newPhone}, {})
    .then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType !== STATUS_CODE_SUCCESS)
      {
         displayAlert(data.data.message, "modal-change-phone-status-bar-id", "changeUserPhone:changeUserPhonePost()");
         console.log("Error: Leaving changeUserPhone()");
         return;
      }

      updateCognitoUserPhone(newPhone);

      viewDisplayChangeUserPhoneSuccessModal();
    });

  console.log("Leaving changeUserPhone()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

  function clearPreferencesModalCheckboxes()
  {
    console.log("Entering clearPreferencesModalCheckboxes()");

    document.getElementById("modal-preferences-email-checkbox-id").checked      = false;
    document.getElementById("modal-preferences-sms-checkbox-id").checked        = false;
    document.getElementById("modal-preferences-email-checkbox-id").checked      = false;
    document.getElementById("modal-preferences-sms-checkbox-id").checked        = false;
    document.getElementById("modal-preferences-daily-radio-id").checked         = false;
    document.getElementById("modal-preferences-twice-daily-radio-id").checked   = false;
    document.getElementById("modal-preferences-weekly-radio-id").checked        = false;
    document.getElementById("modal-preferences-twice-weekly-radio-id").checked  = false;

    console.log("Leaving clearPreferencesModalCheckboxes()");
  }

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayDeliveryFrequencyInModal(deliveryFrequency)
{
  console.log("Entering viewDisplayDeliveryFrequencyInModal()");

  if (deliveryFrequency === 'daily')
  {
    document.getElementById("modal-preferences-daily-radio-id").checked         = true;
  }
  else if (deliveryFrequency === 'twiceDaily')
  {
    document.getElementById("modal-preferences-twice-daily-radio-id").checked   = true;
  }
  else if (deliveryFrequency === 'weekly')
  {
    document.getElementById("modal-preferences-weekly-radio-id").checked        = true;
  }
  else if  (deliveryFrequency === 'twiceWeekly')
  {
    document.getElementById("modal-preferences-twice-weekly-radio-id").checked  = true;
  }

  console.log("Leaving viewDisplayDeliveryFrequencyInModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayDeliveryMethodInModal(deliveryMethod)
{
  console.log("Entering viewDisplayDeliveryMethodInModal()");

  if (deliveryMethod === 'emailsms')
  {
    document.getElementById("modal-preferences-email-checkbox-id").checked  = true;
    document.getElementById("modal-preferences-sms-checkbox-id").checked    = true;
  }
  else if (deliveryMethod === 'email')
  {
    document.getElementById("modal-preferences-email-checkbox-id").checked  = true;
  }
  else if (deliveryMethod === 'sms')
  {
    document.getElementById("modal-preferences-sms-checkbox-id").checked    = true;
  }

  console.log("Leaving viewDisplayDeliveryMethodInModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayDeliveryPreferencesModal(deliveryMethod, deliveryFrequency)
{
  console.log("Entering viewDisplayDeliveryPreferencesModal()");

  $("#preferences-modal-id").modal();

  clearPreferencesModalCheckboxes();

  viewDisplayDeliveryMethodInModal(deliveryMethod);

  viewDisplayDeliveryFrequencyInModal(deliveryFrequency);

  console.log("Leaving viewDisplayDeliveryPreferencesModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function displayDeliveryPreferencesModal(event)
{
  console.log("Entering displayDeliveryPreferencesModal()");

  event.preventDefault();

  const email   = sessionStorage.getItem('userEmail');

  const client  = apigClientFactory.newClient();

  client.getNuggeteerDeliveryPreferencesPost({}, {email:email}, {})
    .then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType !== STATUS_CODE_SUCCESS)
      {
        displayAlert(data.data.message, "modal-header-status-bar-id", "retrieveDeliveryPreferences");
        console.log("Error: Leaving displayDeliveryPreferencesModal()");
        return({});
      }

      const deliveryPreferencesData = data.data.message[0];

      console.log("deliveryPreferencesData = ", JSON.stringify(deliveryPreferencesData));
 
      /* TODO: What does it mean if prefs are null? */
      if (deliveryPreferencesData === null)
      {
          console.log("Error: Leaving displayDeliveryPreferencesModal()");
          return;
      }

      const deliveryMethod          = deliveryPreferencesData.deliveryMethod;
      const deliveryFrequency       = deliveryPreferencesData.deliveryFrequency;

      viewDisplayDeliveryPreferencesModal(deliveryMethod, deliveryFrequency);
  });

  console.log("Leaving displayDeliveryPreferencesModal()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewGetDeliveryMethodFromModal()
{
  console.log("Entering viewGetDeliveryMethodFromModal()");

  const emailDelivery = document.getElementById("modal-preferences-email-checkbox-id").checked;
  const smsDelivery   = document.getElementById("modal-preferences-sms-checkbox-id").checked;

  let deliveryMethod;

  if (emailDelivery && smsDelivery)
  {
    deliveryMethod = 'emailsms';
  }
  else if (emailDelivery)
  {
    deliveryMethod = 'email';
  }
  else if (smsDelivery)
  {
    deliveryMethod = 'sms';
  }
  else
  {
    deliveryMethod = 'none';
  }

  console.log("Leaving viewGetDeliveryMethodFromModal()");

  return(deliveryMethod);
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewGetDeliveryFrequencyFromModal()
{
  console.log("Entering viewGetDeliveryFrequencyFromModal()");

  const dailyDelivery       = document.getElementById("modal-preferences-daily-radio-id").checked;
  const twiceDailyDelivery  = document.getElementById("modal-preferences-twice-daily-radio-id").checked;
  const weeklyDelivery      = document.getElementById("modal-preferences-weekly-radio-id").checked;
  const twiceWeeklyDelivery = document.getElementById("modal-preferences-twice-weekly-radio-id").checked;

  let deliveryFrequency;

  if (dailyDelivery)
  {
    deliveryFrequency = 'daily';
  }
  else if (twiceDailyDelivery)
  {
    deliveryFrequency = 'twiceDaily';
  }
  else if (weeklyDelivery)
  {
    deliveryFrequency = 'weekly';
  }
  else if (twiceWeeklyDelivery)
  {
    deliveryFrequency = 'twiceWeekly';
  }
  else
  {
    deliveryFrequency = 'never';
  }

  console.log("Leaving viewGetDeliveryFrequencyFromModal()");

  return(deliveryFrequency);
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

/*
 * TODO: Use map or something for mapping delivery methods.
*/

function updateDeliveryPreferences(event)
{
  event.preventDefault();

  console.log("Entering updateDeliveryPreferences()");

  const deliveryMethod    = viewGetDeliveryMethodFromModal();
  const deliveryFrequency = viewGetDeliveryFrequencyFromModal();

  const email = sessionStorage.getItem('userEmail');

  const client = apigClientFactory.newClient();

  client.setNuggeteerDeliveryPreferencesPost({}, {email:email, deliveryMethod:deliveryMethod, deliveryFrequency:deliveryFrequency}, {}).
    then(function(data)
    {
      let statusCodeType = getStatusCodeType(data.data.statusCode);

      if (statusCodeType !== STATUS_CODE_SUCCESS)
      {
        displayAlert(data.data.message, "modal-preferences-status-bar-id", "updateDeliveryPreferences");
      }
      else
      {
        $("#preferences-success-modal-id").modal();
      }
    });

  /* TODO: Will this be automaticall hidden? */
  $("#preferences-modal-id").modal("hide");

  console.log("Leaving updateDeliveryPreferences()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function viewDisplayLoggedInState()
{
  console.log("Entering viewDisplayLoggedInState()");

  document.getElementById("navbar-log-in-out-item-id").innerHTML = "Logoff";
  document.getElementById("navbar-registration-item-id").style.visibility = "hidden";
  document.getElementById("navbar-preferences-item-id").style.visibility = "visible"; 

  document.getElementById("subscribe-heading-id").style.visibility = "hidden"; 
  document.getElementById("subscribe-user-email-input-id").style.visibility = "hidden";
  document.getElementById("subscribe-button-id").style.visibility = "hidden";

  document.getElementById("join-heading-text-id").style.visibility = "hidden";
  document.getElementById("join-button-id").style.visibility = "hidden";
  document.getElementById("join-description-text-id").style.visibility = "hidden";

  document.getElementById("footer-unsubscribe-link-id").style.visibility = "hidden";
  document.getElementById("footer-delete-account-link-id").style.visibility = "visible";

  console.log("Leaving viewDisplayLoggedInState()");
}

/****************************************************************/
/****************************************************************/

function viewDisplayRegisteredState()
{
  console.log("Entering viewDisplayRegisteredState()");

  document.getElementById("navbar-log-in-out-item-id").innerHTML = "Login";
  document.getElementById("navbar-registration-item-id").style.visibility = "hidden"; 

  document.getElementById("subscribe-heading-id").style.visibility = "hidden";
  document.getElementById("subscribe-user-email-input-id").style.visibility = "hidden";
  document.getElementById("subscribe-button-id").style.visibility = "hidden";

  document.getElementById("join-heading-text-id").style.visibility = "hidden";
  document.getElementById("join-button-id").style.visibility = "hidden";
  document.getElementById("join-description-text-id").style.visibility = "hidden";

  document.getElementById("footer-unsubscribe-link-id").style.visibility = "hidden";
  document.getElementById("footer-delete-account-link-id").style.visibility = "hidden";

  console.log("Leaving viewDisplayRegisteredState()");
}

/****************************************************************/
/****************************************************************/

function viewDisplayLoggedOutState()
{
  console.log("Entering viewDisplayLoggedOutState()");
  
  document.getElementById("navbar-log-in-out-item-id").innerHTML = "Login";
  document.getElementById("navbar-registration-item-id").style.visibility = "visible"; 
  document.getElementById("navbar-preferences-item-id").style.visibility = "hidden"; 

  document.getElementById("subscribe-heading-id").style.visibility = "visible"; 
  document.getElementById("subscribe-user-email-input-id").style.visibility = "visible";
  document.getElementById("subscribe-button-id").style.visibility = "visible";
  document.getElementById("join-button-id").style.visibility = "visible";
  document.getElementById("join-description-text-id").style.visibility = "visible"; 

  document.getElementById("footer-unsubscribe-link-id").style.visibility = "visible";
  document.getElementById("footer-delete-account-link-id").style.visibility = "hidden"; 

  console.log("Leaving viewDisplayLoggedOutState()");
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function displayAlert(err, statusBarID, callingFunction)
{
	console.log(callingFunction + "(): ", err);

  document.getElementById(statusBarID).innerHTML = "<div class='alert alert-danger alert-dismissible'><a href = '#' class = 'close' data-dismiss = 'alert'> &times;</a>Error: " + err + "</div>";

  /*
   *	<div class = "alert alert-success">
   			<a href = "#" class = "close" data-dismiss = "alert">
      		&times;
     		</a>
   
  	 		<strong>Warning!</strong> There was a problem with your network connection.
    	</div>
	*/
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function emailIsValid (email)
{
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/

function phoneIsValid (phone)
{
  console.log("phone = ", phone);
	const pattern = /^\d{10}$/;

	if(phone.match(pattern))
	{
		return(true);
	}
	else
	{
    console.log("phone no match");
		return(false);
	}
}

/****************************************************************/
/****************************************************************/

function pinIsValid (pin)
{
  console.log("pin = ", pin);
	const pattern = /^\d{6}$/;

	if(pin.match(pattern))
	{
		return(true);
	}
	else
	{
    console.log("pin no match");
		return(false);
	}
}

/****************************************************************/
/****************************************************************/
