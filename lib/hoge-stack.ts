import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { LambdaRestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class HogeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // s3
    const bucket = new s3.Bucket(this, "hoge_bucket", {
      versioned: true,
    });

    // Lambda
    const lambdaFn = new NodejsFunction(this, "hoge_lambda", {
      runtime: lambda.Runtime.NODEJS_16_X,
      memorySize: 1000,
      timeout: cdk.Duration.seconds(30),
    });
    if (lambdaFn.role) {
      bucket.grantReadWrite(lambdaFn.role);
    }

    // Api gateway
    const api = new LambdaRestApi(this, "hoge_apigateway", {
      handler: lambdaFn,
      proxy: false,
    });
    const hoge = api.root.addResource("hoge");
    hoge.addMethod("GET", new LambdaIntegration(lambdaFn));
  }
}
