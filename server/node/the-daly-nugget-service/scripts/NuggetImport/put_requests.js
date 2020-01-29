var fs                  = require('fs');
var parse               = require('csv-parse');
var async               = require('async');
const AWS               = require('aws-sdk');
const uuidv1						= require('uuid/v1');

const serverlessModeIsOffline   = process.env.IS_LOCAL;
/*
const importNuggetsUtilityDir   = process.env.DN_IMPORT_NUGGETS_DIR;
const nuggetBaseTable           = process.env.NUGGET_BASE_TABLE_STAGE;
let projectStage                = process.env.DN_PROJECT_STAGE;
*/

// User following if running from terminal window.
let projectStage               = "prod";
const importNuggetsUtilityDir   = ".";
const nuggetBaseTable           = "nugget-base-prod";

console.log("nuggetBaseTable = ", nuggetBaseTable);

// MAKE SURE TO LAUNCH `dynamodb-local` EXTERNALLY FIRST IF USING LOCALHOST!

console.log("serverlessModeIsOffline = ", serverlessModeIsOffline);

if (serverlessModeIsOffline === 'true')
{
  console.log("serverlessModeIsOffline TRUE branch");
  AWS.config.update(
  {
    region: "us-east-1"
   ,endpoint: "http://localhost:8000"
  });
}
else
{
  AWS.config.update(
  {
    region: "us-east-1"
  });
}

const dynamodbDocClient   = new AWS.DynamoDB();
const csv_filename        = importNuggetsUtilityDir + "/nuggets-to-import.txt";
console.log("csv_filename = ", csv_filename);
let rs                    = fs.createReadStream(csv_filename);

parser = parse({
  columns : true,
  delimiter : '%'
  }, function(err, data) {
    var split_arrays = [], size = 25;

    while (data.length > 0) {

      //split_arrays.push(data.splice(0, size));
      let cur25 = data.splice(0, size);

      let item_data = [];
 
      for (var i = cur25.length - 1; i >= 0; i--) {

        let id = uuidv1();

        const this_item = {

          "PutRequest" : {

            "Item": {
              "id":     {
                "S": id
              },
              "quote":  {
                "S": cur25[i].quote
              },
              "author": {
                "S": cur25[i].author
              },
              "topic":  {
                "S": cur25[i].topic
              }
 
            } /* End Item */

          } /* End PutRequest */
 
        }; /* End this_item */

        item_data.push(this_item);

 //       console.log("item_data = ", JSON.stringify(item_data));
 //       console.log("i = ", i);
      }

      split_arrays.push(item_data);

    }

// console.log("split_arrays = ", JSON.stringify(split_arrays));

    data_imported = false;
    chunk_no = 1;

    console.log("BEFORE EACH: nuggetBaseTable = ", nuggetBaseTable);

    async.each(split_arrays, (item_data, callback) => {

    console.log("AFTER EACH: nuggetBaseTable = ", nuggetBaseTable);

    let params;

    if (projectStage === 'prod')
    {
      params =
      {
        RequestItems:
        {
          "nugget-base-prod": item_data
        }
      };
    }
    else
    {
      params =
      {
        RequestItems:
        {
          "nugget-base-dev": item_data
        }
      };
    };

        dynamodbDocClient.batchWriteItem(params, function(err, res, cap) {
            if (err === null) {
                console.log('Success chunk #' + chunk_no);
                data_imported = true;
            } else {
                console.log(err);
                console.log('Fail chunk #' + chunk_no);
                data_imported = false;
            }
            chunk_no++;
            callback();
        });

    }, () => {
        // run after loops
        console.log('all data imported....');
    });
});
rs.pipe(parser);

console.log("Exiting seeder");
