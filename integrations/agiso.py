"""Agiso request signing shared by all seven customer-authorized shop platforms.

The platform-specific API paths and response fields must come from the customer's
approved ecommerce application documentation before network calls are enabled.
"""
import hashlib
import time


def signed_fields(fields, app_secret, *, timestamp=None):
    """Return form fields with the signature documented by Agiso Open Platform."""
    if not app_secret:
        raise ValueError('缺少客户应用 AppSecret')
    params = {str(key): str(value) for key, value in fields.items() if key != 'sign'}
    params['timestamp'] = str(int(time.time()) if timestamp is None else int(timestamp))
    source = app_secret + ''.join(key + params[key] for key in sorted(params)) + app_secret
    params['sign'] = hashlib.md5(source.encode('utf-8')).hexdigest()
    return params


def auth_headers(access_token):
    if not access_token:
        raise ValueError('缺少客户店铺 AccessToken')
    return {'Authorization': 'Bearer ' + access_token, 'ApiVersion': '1'}
