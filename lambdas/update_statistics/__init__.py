import gzip
import json
import logging
import os
import time
from io import BytesIO

import boto3

from shared import dynamo_to_python, middleware

DYNAMODB_TABLE_NAME = os.environ.get("DYNAMODB_TABLE_NAME", "nia-db")

dynamodb = boto3.client('dynamodb')
table = boto3.resource('dynamodb').Table(DYNAMODB_TABLE_NAME)

s3 = boto3.client('s3')

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def log_str_to_json(log_data: str) -> list[dict]:
    lines = log_data.strip().split("\n")
    version = lines[0].split(": ")[1]
    fields = lines[1].split(": ")[1].split()

    all_data = [
        {fields[i]: log_values[i] for i in range(len(fields))} for log_values in [line.split() for line in lines[2:]]
    ]

    return all_data


@middleware(logger)
def handler(event, context):
    for s3_record in event["Records"]:
        bucket = s3_record["s3"]["bucket"]["name"]
        key = s3_record["s3"]["object"]["key"]

        # S3 객체 가져오기
        s3_object = s3.get_object(Bucket=bucket, Key=key)

        gzip_file_content = s3_object['Body'].read()

        # Gzip 파일 압축 해제
        with gzip.GzipFile(fileobj=BytesIO(gzip_file_content)) as gzipfile:
            log_data = gzipfile.read().decode('utf-8')

        # 로그 데이터를 JSON으로 변환
        all_data = log_str_to_json(log_data)

        # (SURL, 날짜)를 키로 사용하는 데이터로 가공
        date_data = dict()
        for data in all_data:
            surl = data["cs-uri-stem"][1:]
            key = (surl, data["date"])
            date_data[key] = date_data.get(key, 0) + 1

        # (SURL, 레퍼런스)를 키로 사용하는 데이터로 가공
        ref_data = dict()
        for data in all_data:
            surl = data["cs-uri-stem"][1:]
            key = (surl, data["cs(Referer)"])
            ref_data[key] = ref_data.get(key, 0) + 1

        # DynamoDB에 데이터 저장
        dynamodb.transact_write_items(
            TransactItems=[
                # 날짜별 데이터 업데이트
                {
                    'Update': {
                        'TableName': DYNAMODB_TABLE_NAME,
                        'Key': {
                            'PK': {'S': f"SURL#{key[0]}"},
                            'SK': {'S': f"DATE#{key[1]}"},
                        },
                        'UpdateExpression': 'SET #hits = if_not_exists(#hits, :initial) + :hits, #type = :type',
                        'ExpressionAttributeNames': {'#hits': 'hits', '#type': 'type'},
                        'ExpressionAttributeValues': {
                            ':initial': {'N': '0'},
                            ':hits': {'N': str(value)},
                            ':type': {'S': 'DATE'},
                        },
                    }
                }
                for key, value in date_data.items()
            ]
            + [
                # 레퍼런스별 데이터 업데이트
                {
                    'Update': {
                        'TableName': DYNAMODB_TABLE_NAME,
                        'Key': {
                            'PK': {'S': f"SURL#{key[0]}"},
                            'SK': {'S': f"REF#{key[1]}"},
                        },
                        'UpdateExpression': 'SET #hits = if_not_exists(#hits, :initial) + :hits, #type = :type',
                        'ExpressionAttributeNames': {'#hits': 'hits', '#type': 'type'},
                        'ExpressionAttributeValues': {
                            ':initial': {'N': '0'},
                            ':hits': {'N': str(value)},
                            ':type': {'S': 'REF'},
                        },
                    }
                }
                for key, value in ref_data.items()
            ]
        )
