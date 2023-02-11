import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: "hogestack-hogebucketb99ea3ad-5pmo1y86z2g9",
      Key: "hoge-sample",
      Body: "hello world",
    };
    await s3.putObject(params).promise();
    const response = {
      statusCode: 200,
      body: "OK",
    };
    return response;
  } catch (error: any) {
    const response = {
      statusCode: 500,
      body: `Error: ${error.message}`,
    };
    return response;
  }
};
