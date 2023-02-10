// import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as chromium from "chrome-aws-lambda";
import * as AWS from "aws-sdk";

const s3 = new AWS.S3();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // リクエストからidを取得
  const id = event.pathParameters?.id;
  // idをもとにURLを生成
  // const url = `https://example.com/${id}`;
  const url = `https://google.com`;
  let browser: any = null;

  try {
    // Puppeteerでブラウザを起動
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    // URLにアクセス
    await page.goto(url);
    // スクリーンショットを撮る
    const screenshot = await page.screenshot({ type: "png" });
    // S3に格納するためのオブジェクトを作成
    const params: AWS.S3.PutObjectRequest = {
      Bucket: "MyFirstHogeBucket",
      Key: `screenshots/${id}.png`,
      Body: screenshot,
    };
    // S3に格納
    await s3.putObject(params).promise();
    // 成功した場合のレスポンスを作成
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `Screen shot for ${id} was saved to S3.`,
      }),
    };
    return response;
  } catch (error: any) {
    // 失敗した場合のレスポンスを作成
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to take screen shot for ${id}. Error: ${error.message}`,
      }),
    };
    return response;
  } finally {
    // ブラウザを終了
    if (browser) {
      await browser.close();
    }
  }
};
