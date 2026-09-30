from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import secrets


class InternalService:
    """
    Simple class used to adhere to DRF's policies when handing authentication from within a decorator on a function-based view.
    """
    is_authenticated = True


class InternalAPIKeyAuthentication(BaseAuthentication):
    """
    Auth class used within a decorator to ensure a valid X-API-Key is present in the request's headers.
    """
    def authenticate(self, request):
        api_key = request.headers.get("X-API-Key")

        if not secrets.compare_digest(
            api_key or "",
            settings.INTERNAL_API_KEY,
        ):
            raise AuthenticationFailed("Invalid API key.")

        # Mark request as authenticated by returning a lightweight service principal.
        return (InternalService(), None)