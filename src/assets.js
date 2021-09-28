import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main() {
  const getParams = {
    TableName: process.env.tableName
  };
  const results = await dynamoDb.scan(getParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(results.Items),
  };


}