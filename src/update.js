import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event) {
  const getParams = {
    TableName: process.env.tableName,
    Key: {
      id: event.pathParameters.id,
    },
  };
  const results = await dynamoDb.get(getParams).promise();

  let totalVotes = results.Item ? results.Item.totalVotes : 0;
  let totalRating = results.Item ? results.Item.totalRating : 0;

  const putParams = {
    TableName: process.env.tableName,
    Key: {
      id: event.pathParameters.id,
    },
    UpdateExpression: "SET totalVotes = :totalVotes, totalRating = :totalRating",
    ExpressionAttributeValues: {
      ":totalVotes": ++totalVotes,
      ":totalRating": totalRating+parseInt(event.pathParameters.vote),
    },
  };
  await dynamoDb.update(putParams).promise();

  return {
    statusCode: 200,
    body: "Updated",
  };


}