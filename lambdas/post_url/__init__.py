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

from shared import middleware

DYNAMODB_TABLE_NAME = os.environ.get("DYNAMODB_TABLE_NAME", "nia-db")

dynamodb = boto3.client('dynamodb')
table = boto3.resource('dynamodb').Table(DYNAMODB_TABLE_NAME)

logger = logging.getLogger()
logger.setLevel(logging.INFO)


# TODO: 추후 해싱 기반으로 변경
def get_random_url(original_url: str):
    for _ in range(100):
        short_url = "".join(random.choices(string.ascii_letters + string.digits, k=8))
        res = dynamodb.query(
            TableName=DYNAMODB_TABLE_NAME,
            IndexName="GSI-SK-PK",
            KeyConditionExpression="SK = :sk",
            ExpressionAttributeValues={":sk": {"S": f"SURL#{short_url}"}, ":now": {"N": str(time.time())}},
            ExpressionAttributeNames={"#TTL": "TTL"},
            FilterExpression="#TTL > :now",
        )
        if res["Count"] == 0:
            return short_url
    raise Exception("단축 URL을 생성하는 것에 실패하였습니다.")


def get_metadatas(url: str) -> list[str]:
    res = urllib.request.urlopen(
        urllib.request.Request(
            url=url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            },
            method='GET',
        ),
        timeout=5,
    )
    if not (200 <= res.getcode() < 300):
        return []

    soup = BeautifulSoup(res, "html5lib")

    head = soup.find("head")
    if head is None:
        return []
    meta_tags = head.find_all("meta")

    return [str(tag) for tag in meta_tags]


@middleware(logger)
def handler(event, context):
    body = json.loads(event.get("body", "{}") or "{}")
    original_url = body.get("original_url", None)
    short_url = body.get("short_url", None)
    ttl = time.time() + body.get("ttl", 60 * 60 * 24 * 30 * 6)  # 6 months

    if original_url is None:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "original_url is required"}),
        }

    is_custom_url = short_url is not None

    # 해당 커스텀 URL이 이미 존재하는지 확인
    if is_custom_url:
        res = dynamodb.query(
            TableName=DYNAMODB_TABLE_NAME,
            KeyConditionExpression="PK = :pk",
            FilterExpression="#TTL > :now",
            ExpressionAttributeValues={":pk": {"S": f"SURL#{short_url}"}, ":now": {"N": str(time.time())}},
            ExpressionAttributeNames={"#TTL": "TTL"},
        )
        if res["Count"] != 0:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "해당 단축 URL이 이미 존재합니다."}),
            }
    else:
        short_url = get_random_url(original_url) if short_url is None else short_url

    metas = get_metadatas(original_url)

    # 생성
    res = table.put_item(
        Item={
            "PK": f"SURL#{short_url}",
            "SK": f"URL#{original_url}",
            "TTL": int(ttl + time.time()),
            "created_at": f"{datetime.now()}",
            "metadatas": metas,
        }
    )

    # 성공 시
    if res["ResponseMetadata"]["HTTPStatusCode"] == 200:
        return {
            "statusCode": 200,
            "body": json.dumps({"short_url": short_url}),
        }

    # 실패 시
    return {
        "statusCode": 500,
        "body": json.dumps({"error": "생성된 단축 URL을 저장하는데 실패하였습니다."}),
    }
