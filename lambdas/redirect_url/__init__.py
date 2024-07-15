import json
import logging
import os
import time

import boto3

from shared import dynamo_to_python, middleware

DYNAMODB_TABLE_NAME = os.environ.get("DYNAMODB_TABLE_NAME", "nia-db")

dynamodb = boto3.client('dynamodb')
table = boto3.resource('dynamodb').Table(DYNAMODB_TABLE_NAME)


logger = logging.getLogger()
logger.setLevel(logging.INFO)


@middleware(logger)
def handler(event, context):
    path = event.get("rawPath", "/")
    redirect = event.get("queryStringParameters", {}).get("u", None)

    if path == "/":
        url = "https://nia.junah.dev"
    else:
        # 맨 앞 / 제거
        short_url = path[1:]

        logger.info(json.dumps({"short_url": short_url}))

        res = dynamodb.query(
            TableName=DYNAMODB_TABLE_NAME,
            KeyConditionExpression="PK = :pk",
            FilterExpression="#TTL > :now",
            ExpressionAttributeValues={":pk": {"S": f"SURL#{short_url}"}, ":now": {"N": str(time.time())}},
            ExpressionAttributeNames={"#TTL": "TTL"},
        )

        if res.get("Count", 0) == 0:
            return {
                "statusCode": 302,
                "headers": {"Location": "https://nia.junah.dev/404"},
                "body": "",
            }

        item = dynamo_to_python(res["Items"][0])
        url = item["SK"].split("#")[1]

    with open("./lambdas/redirect_url/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # url 삽입
    html = html.replace("{{url}}", url, -1)  # 뒤에서부터 1개만 바꾸기
    # metadata 삽입
    metadata = "\n".join(item.get("metadatas", []) or [])

    html = html.replace("{{metadata}}", metadata, 1)  # 앞에서부터 1개만 바꾸기

    return {"statusCode": 200, "headers": {"Content-Type": "text/html"}, "body": html}
