"""
URL patterns for the djangoapp application.
"""
from django.urls import path
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # Authentication endpoints
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.register_user, name='register'),
    
    # Car endpoints
    path('get_cars', views.get_cars, name='get_cars'),
    
    # Dealer endpoints (API)
    path('get_dealers', views.get_dealers, name='get_dealers'),
    path('get_dealers/<str:state>', views.get_dealers_by_state, name='get_dealers_by_state'),
    path('dealer/<int:dealer_id>', views.get_dealer, name='get_dealer'),
    
    # Review endpoints (API)
    path('reviews/dealer/<int:dealer_id>', views.get_dealer_reviews, name='get_dealer_reviews'),
    path('add_review', views.add_review, name='add_review'),
    
    # Sentiment analysis endpoint
    path('analyze/<str:review_text>', views.analyze_sentiment, name='analyze_sentiment'),
    
    # Template views
    path('dealers/', views.dealer_list_view, name='dealer_list'),
    path('dealers/<int:dealer_id>/', views.dealer_details_view, name='dealer_details'),
    path('dealers/<int:dealer_id>/add_review/', views.add_review_view, name='add_review_view'),
    path('dealers/<int:dealer_id>/submit_review/', views.submit_review_view, name='submit_review'),
]
