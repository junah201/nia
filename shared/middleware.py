import json
import logging
import traceback


def middleware(logger: logging.Logger | None = None):
    if logger is None:
        logger = logging.getLogger()
        logger.setLevel(logging.INFO)

    def outer(func):
        def inner(event, context):
            logger.info(
                json.dumps(
                    {
                        "type": "REQUEST",
                        "event": event,
                        "body": json.loads(event.get("body", "{}") or "{}"),
                    }
                )
            )

            try:
                res = func(event, context)
            except Exception as e:
                logger.error(
                    json.dumps(
                        {"type": "UNEXCEPTED_ERROR", "error": str(e), "traceback": traceback.format_exc()},
                        ensure_ascii=False,
                    )
                )
                res = {
                    "statusCode": 500,
                    "body": json.dumps(str(e), ensure_ascii=False),
                }

            res = res or dict()
            res['headers'] = res.get('headers', {})
            res['headers']['Access-Control-Allow-Origin'] = '*'
            res['headers']['Content-Type'] = res['headers'].get("Content-Type", 'application/json')
            return res

        return inner

    return outer
