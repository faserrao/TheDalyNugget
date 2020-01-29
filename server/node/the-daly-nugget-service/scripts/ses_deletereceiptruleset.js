var AWS = require('aws-sdk');

const ses = new AWS.SES(
{
  region: process.env.DN_AWS_REGION
});

const params_1 =
{
  RuleSetName: null
};

const params_2 =
{
  RuleSetName: process.env.DN_SES_EMAIL_RECEIPT_RULE_SET_NAME
};

ses.setActiveReceiptRuleSet(params_1, function(err, data)
{
  if (err)
  {
    console.log(err, err.stack);
  }
  else
  {
    console.log(data);

    ses.deleteReceiptRuleSet(params_2, function(err, data)
    {
      if (err)
      {
        console.log(err, err.stack);
      }
      else
      {
        console.log(data);
      }
  });
  }
});
