import json
import logging
import os
import random
import string
import time
import urllib.request
from datetime import datetime

import boto3
from bs4 import BeautifulSoup

from shared import get_user_from_token, middleware
from shared.dynamodb import dynamo_to_python

DYNAMODB_TABLE_NAME = os.environ.get("DYNAMODB_TABLE_NAME", "nia-db")

dynamodb = boto3.client('dynamodb')
table = boto3.resource('dynamodb').Table(DYNAMODB_TABLE_NAME)

cognito_client = boto3.client('cognito-idp')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


@middleware(logger)
def handler(event, context):
    username = event.get("requestContext", {}).get("authorizer", {}).get("claims", {}).get("cognito:username", None)
    if username is None:
        return {
            "statusCode": 401,
            "body": json.dumps({"error": "로그인이 필요합니다."}),
        }

    # get all my urls
    response = dynamodb.query(
        TableName=DYNAMODB_TABLE_NAME,
        IndexName="GSI-user-PK",
        KeyConditionExpression="#user = :user AND begins_with(#PK, :pk)",
        ExpressionAttributeNames={"#user": "user", "#PK": "PK"},
        ExpressionAttributeValues={":user": {'S': username}, ":pk": {'S': "SURL#"}},
    )

    last_evaluated_key = response.get("LastEvaluatedKey", None)
    items = response.get("Items", [])

    while last_evaluated_key:
        response = dynamodb.query(
            TableName=DYNAMODB_TABLE_NAME,
            IndexName="GSI-user-PK",
            KeyConditionExpression="#user = :user AND begins_with(#PK, :pk)",
            ExpressionAttributeNames={"#user": "user", "#PK": "PK"},
            ExpressionAttributeValues={":user": {'S': username}, ":pk": {'S': "SURL#"}},
            ExclusiveStartKey=last_evaluated_key,
        )
        last_evaluated_key = response.get("LastEvaluatedKey", None)
        items.extend(response.get("Items", []))

    items = [dynamo_to_python(item) for item in items]

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "items": [
                    {
                        "PK": item["PK"],
                        "SK": item["SK"],
                        "TTL": item["TTL"],
                        "created_at": item["created_at"],
                    }
                    for item in items
                ],
                "total": len(items),
            }
        ),
    }
