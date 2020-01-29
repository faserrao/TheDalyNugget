"use strict";

exports.getAuthorFromSubject = function (subject)
{
  const subjectArray  = subject.split(':');
  const author        = subjectArray[0];

  return(author);
};


exports.getCategoryFromSubject = function (subject)
{
  const subjectArray  = subject.split(':');
  const category      = subjectArray[1];

  return(category);
};


exports.extractEmailAddress = function (emailFromText)
{
  let leftBracketIndex  = emailFromText.indexOf("<");
  let rightBracketIndex = emailFromText.indexOf(">");

  let emailAddress = emailFromText.slice(leftBracketIndex + 1, rightBracketIndex);

  return(emailAddress);
};


exports.isEmailFromBlessedSource = function (emailSenderAddress)
{
  if (emailSenderAddress === process.env.DN_BLESSED_EMAIL_ADDRESS)
  {
    return(true);
  }
  else
  {
    return(false);
  }
};
