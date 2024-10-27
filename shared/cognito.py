import boto3


def get_user_from_token(token: str, cognito_client: boto3.client = None) -> dict | None:
    if cognito_client is None:
        cognito_client = boto3.client("cognito-idp")
    try:
        response = cognito_client.get_user(AccessToken=token)
        return response
    except Exception as e:
        print(e)
        return None


def get_user_from_username(username: str, cognito_client: boto3.client = None) -> dict | None:
    if cognito_client is None:
        cognito_client = boto3.client("cognito-idp")
    try:
        response = cognito_client.admin_get_user(UserPoolId="us-west-2_7nOfa8k50", Username=username)
        return response
    except Exception as e:
        return None
