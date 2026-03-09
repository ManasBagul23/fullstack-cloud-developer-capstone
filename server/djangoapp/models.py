"""
Django models for the dealer review application.
"""
from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User


class CarMake(models.Model):
    """
    Model representing a car manufacturer/make.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    founded_year = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = 'Car Make'
        verbose_name_plural = 'Car Makes'


class CarModel(models.Model):
    """
    Model representing a car model.
    """
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('COUPE', 'Coupe'),
        ('CONVERTIBLE', 'Convertible'),
        ('HATCHBACK', 'Hatchback'),
        ('PICKUP', 'Pickup'),
        ('VAN', 'Van'),
        ('MINIVAN', 'Minivan'),
        ('SPORTS', 'Sports Car'),
        ('LUXURY', 'Luxury'),
        ('ELECTRIC', 'Electric'),
        ('HYBRID', 'Hybrid'),
    ]

    car_make = models.ForeignKey(
        CarMake, 
        on_delete=models.CASCADE, 
        related_name='car_models'
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CAR_TYPES, default='SEDAN')
    year = models.IntegerField()
    dealer_id = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"

    class Meta:
        ordering = ['car_make', 'name', '-year']
        verbose_name = 'Car Model'
        verbose_name_plural = 'Car Models'


class CarDealer:
    """
    A plain Python class to hold dealer data from the microservice.
    Not a Django model - just a data container.
    """
    def __init__(self, id, short_name, full_name, city, state, address, zip, lat, long):
        self.id = id
        self.short_name = short_name
        self.full_name = full_name
        self.city = city
        self.state = state
        self.address = address
        self.zip = zip
        self.lat = lat
        self.long = long

    def __str__(self):
        return f"{self.full_name} - {self.city}, {self.state}"

    def to_dict(self):
        return {
            'id': self.id,
            'short_name': self.short_name,
            'full_name': self.full_name,
            'city': self.city,
            'state': self.state,
            'address': self.address,
            'zip': self.zip,
            'lat': self.lat,
            'long': self.long
        }


class DealerReview:
    """
    A plain Python class to hold review data from the microservice.
    Not a Django model - just a data container.
    """
    def __init__(self, id, dealer_id, name, review, purchase, purchase_date, 
                 car_make, car_model, car_year, sentiment=None):
        self.id = id
        self.dealer_id = dealer_id
        self.name = name
        self.review = review
        self.purchase = purchase
        self.purchase_date = purchase_date
        self.car_make = car_make
        self.car_model = car_model
        self.car_year = car_year
        self.sentiment = sentiment

    def __str__(self):
        return f"Review by {self.name} for dealer {self.dealer_id}"

    def to_dict(self):
        return {
            'id': self.id,
            'dealer_id': self.dealer_id,
            'name': self.name,
            'review': self.review,
            'purchase': self.purchase,
            'purchase_date': self.purchase_date,
            'car_make': self.car_make,
            'car_model': self.car_model,
            'car_year': self.car_year,
            'sentiment': self.sentiment
        }
