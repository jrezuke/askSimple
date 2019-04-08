var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});
const tableName = "dynamodb-starter";

var dbHelper = function () { };
var docClient = new AWS.DynamoDB.DocumentClient();

dbHelper.prototype.addFruit = (item, userId, deviceId) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Item: {
              'movieTitle' : item,
              'userId': userId,
              'deviceId': deviceId
            }
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.log("Unable to insert =>", JSON.stringify(err))
                return reject("Unable to insert");
            }
            console.log("Saved Data, ", JSON.stringify(data));
            resolve(data);
        });
    });
}

dbHelper.prototype.getFruit = (fruit, userId) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: tableName,
            Key: {
                "userId": userId,
                "movieTitle": fruit 
            },
            ConditionExpression: "attribute_exists(fruit)"
        }
        docClient.get(params, function (err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                return reject(JSON.stringify(err, null, 2))
            }
            console.log(JSON.stringify(err));
            console.log("get item succeeded:", JSON.stringify(data, null, 2));
            resolve(data)
        });
    });
}
module.exports = new dbHelper();