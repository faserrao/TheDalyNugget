module.exports.serverlessVariables = () =>
{
	var fs = require("fs");


// path.resolve(__dirname, 'dns-ses-text-rec-val.txt')


	var sesTextRecVal = fs.readFileSync("/Users/fas/MyStuff/Business/Projects/CurrentProjects/TheDalyNugget/server/node/the-daly-nugget-service/scripts/dns-ses-text-rec-val.txt").toString();

  return {
    sesTextRecVal : sesTextRecVal
  };
};
