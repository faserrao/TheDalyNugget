"use strict";

/****************************************************************/

$(document).ready(function()
{
  syncSubscriberVerification();
});

/****************************************************************/

/****************************************************************/

function syncSubscriberVerification()
{
  let client;

  client = apigClientFactory.newClient();

  client.syncSubscriberVerificationGet().then(function(data)
  {

  });
}
