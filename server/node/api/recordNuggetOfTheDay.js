"use strict";

const db                      = require("./dnmDbObjects.js").db;
const emailFunctions          = require("./dnmEmailFunctions.js");
const getEmailFromBucket      = require("./dnmGetEmailFromBucket.js").getEmailFromBucket;
const updateNuggetHistory     = require("./dnmUpdateNuggetHistory.js").updateNuggetHistory;
const updateNuggetOfTheDay    = require("./dnmUpdateNuggetOfTheDay.js").updateNuggetOfTheDay;
const RESPONSE                = require("./dnmResponseCodes.js").RESPONSE;


function createNuggetFromEmail(email)
{
  console.log("Entering createNuggetFromEmail()");

  console.log('createNuggetFromEmail(): date:',        email.date);
  console.log('createNuggetFromEmail(): subject:',     email.subject);
  console.log('createNuggetFromEmail(): body:',        email.text);
  console.log('createNuggetFromEmail(): from:',        email.from.text);
  console.log('createNuggetFromEmail(): attachments:', email.attachments);

  const author    = emailFunctions.getAuthorFromSubject(email.subject);
  const category  = emailFunctions.getCategoryFromSubject(email.subject);
  const emailDate = email.date.toISOString().substring(0, 10);

  const nugget = 
  {
    emailDate:  emailDate,
    quote:      email.text,
    author:     author,
    category:   category
  };

  console.log("Leaving createNuggetFromEmail()");

  return(nugget);
}


exports.handler = async (event, context) =>
{
  console.log("Lambda: Entering recordNuggetOfTheDay()");

  const emailRecord = event.Records[0];

  let data = await getEmailFromBucket(emailRecord);
  if (data.error === true)
  {
    console.log("Lambda: recordNuggetOftheDay(): getEmailFromBucket() Error");
    console.log("Lambda: Leaving recordNuggetOfTheDay()");
    return(RESPONSE.ERROR_S3_GET_OBJECT);
  }

  const emailSenderAddress = emailFunctions.extractEmailAddress(data.email.from.text);
  console.log("Lambda: recordNuggetOfTheDay(): emailSenderAddress = ", emailSenderAddress);

  if (!(emailFunctions.isEmailFromBlessedSource(emailSenderAddress)))
  {
    console.log("Lambda: recordNuggetOftheDay(): Error: Unblessed email source: ", emailSenderAddress);
    console.log("Lambda: Leaving recordNuggetOfTheDay()");
    return(RESPONSE.UNBLESSED_EMAIL_SOURCE);
  }

  const nugget = createNuggetFromEmail(data.email);

  console.log("Lambda: recordNuggetOfTheDay(): nugget = ", nugget);

  let updateNuggetHistoryPromise = updateNuggetHistory(db, nugget);
  let updateNuggetOfTheDayPromise = updateNuggetOfTheDay(db, nugget);

  let unhError = await updateNuggetHistoryPromise;
  if (unhError === true)
  {
    console.log("Lambda: recordNuggetOftheDay(): updateNuggetHistory() Error");
  }

  let unodError = await updateNuggetOfTheDayPromise;
  if (unodError === true)
  {
    console.log("Lambda: recordNuggetOftheDay(): updateNuggetOfTheDay() Error");
  }

  console.log("Lambda: Leaving recordNuggetOfTheDay()");

  return(RESPONSE.OK);
};
