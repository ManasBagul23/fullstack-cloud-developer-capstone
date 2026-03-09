"""
Django app configuration for djangoapp.
"""
from django.apps import AppConfig


class DjangoappConfig(AppConfig):
    """
    Configuration class for the djangoapp application.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'djangoapp'
    verbose_name = 'Dealer Review Application'
