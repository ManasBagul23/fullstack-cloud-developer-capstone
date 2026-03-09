"""
Django admin configuration for the djangoapp application.
"""
from django.contrib import admin
from .models import CarMake, CarModel


class CarModelInline(admin.TabularInline):
    """
    Inline admin for car models within car make.
    """
    model = CarModel
    extra = 1


class CarModelAdmin(admin.ModelAdmin):
    """
    Admin configuration for CarModel.
    """
    list_display = ('name', 'car_make', 'type', 'year')
    list_filter = ('car_make', 'type', 'year')
    search_fields = ('name', 'car_make__name')
    ordering = ('car_make', 'name', '-year')


class CarMakeAdmin(admin.ModelAdmin):
    """
    Admin configuration for CarMake.
    """
    list_display = ('name', 'description', 'country', 'founded_year')
    search_fields = ('name', 'description')
    list_filter = ('country',)
    ordering = ('name',)
    inlines = [CarModelInline]


# Register models with admin
admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
