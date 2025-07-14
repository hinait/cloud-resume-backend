// index.js
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();


AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
console.log("Current table name:", tableName);

exports.handler = async (event) => {
    try {
        const result = await dynamo.update({
            TableName: tableName,
            Key: { visits: 'visits' },
            UpdateExpression: 'SET visitCount = if_not_exists(visitCount, :zero) + :inc',
            ExpressionAttributeValues: {
                ':inc': 1,
                ':zero': 0
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();

        const newCount = result.Attributes.visitCount;

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ count: newCount })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};
