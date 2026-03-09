"""
Django views for the dealer review application.
"""
import json
import logging
import requests
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.conf import settings

from .models import CarMake, CarModel, CarDealer, DealerReview
from .sentiment_analyzer import analyze_review_sentiment

# Configure logging
logger = logging.getLogger(__name__)

# Microservice URL from settings
DEALER_SERVICE_URL = getattr(settings, 'DEALER_MICROSERVICE_URL', 'http://localhost:3030')


# ==================== Authentication Views ====================

@csrf_exempt
def login_user(request):
    """
    Handle user login via POST request.
    
    Expected POST data:
    {
        "userName": "string",
        "password": "string"
    }
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            password = data.get('password')
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                login(request, user)
                response_data = {
                    "userName": username,
                    "status": "Authenticated"
                }
                return JsonResponse(response_data)
            else:
                response_data = {
                    "userName": username,
                    "status": "Invalid credentials"
                }
                return JsonResponse(response_data, status=401)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)


def logout_user(request):
    """
    Handle user logout.
    """
    if request.user.is_authenticated:
        username = request.user.username
        logout(request)
        return JsonResponse({"userName": username, "status": "Logged out"})
    return JsonResponse({"status": "Not logged in"})


@csrf_exempt
def register_user(request):
    """
    Handle user registration via POST request.
    
    Expected POST data:
    {
        "userName": "string",
        "password": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
    }
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            password = data.get('password')
            first_name = data.get('firstName', '')
            last_name = data.get('lastName', '')
            email = data.get('email', '')
            
            # Check if username already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({
                    "userName": username,
                    "error": "Already Registered"
                }, status=400)
            
            # Create the user
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            
            # Log the user in
            login(request, user)
            
            return JsonResponse({
                "userName": username,
                "status": "Registered"
            })
            
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)


# ==================== Car Make/Model Views ====================

def get_cars(request):
    """
    Get all car makes and their models.
    """
    try:
        car_makes = CarMake.objects.all()
        cars_data = []
        
        for make in car_makes:
            make_data = {
                "id": make.id,
                "name": make.name,
                "description": make.description,
                "models": []
            }
            
            for model in make.car_models.all():
                make_data["models"].append({
                    "id": model.id,
                    "name": model.name,
                    "type": model.type,
                    "year": model.year
                })
            
            cars_data.append(make_data)
        
        return JsonResponse({"carMakes": cars_data}, safe=False)
    
    except Exception as e:
        logger.error(f"Error getting cars: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


# ==================== Dealer Views ====================

def get_dealers(request):
    """
    Get all dealers from the microservice.
    """
    try:
        url = f"{DEALER_SERVICE_URL}/fetchDealers"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            dealers = response.json()
            return JsonResponse({"status": 200, "dealers": dealers})
        else:
            return JsonResponse({
                "status": response.status_code,
                "message": "Error fetching dealers"
            }, status=response.status_code)
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching dealers: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


def get_dealers_by_state(request, state):
    """
    Get dealers filtered by state from the microservice.
    """
    try:
        url = f"{DEALER_SERVICE_URL}/fetchDealers/state/{state}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            dealers = response.json()
            return JsonResponse({"status": 200, "dealers": dealers})
        else:
            return JsonResponse({
                "status": response.status_code,
                "message": f"Error fetching dealers for state: {state}"
            }, status=response.status_code)
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching dealers by state: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


def get_dealer(request, dealer_id):
    """
    Get a specific dealer by ID from the microservice.
    """
    try:
        url = f"{DEALER_SERVICE_URL}/fetchDealer/{dealer_id}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            dealer = response.json()
            return JsonResponse({"status": 200, "dealer": dealer})
        else:
            return JsonResponse({
                "status": response.status_code,
                "message": f"Dealer not found with ID: {dealer_id}"
            }, status=response.status_code)
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching dealer: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


# ==================== Review Views ====================

def get_dealer_reviews(request, dealer_id):
    """
    Get all reviews for a specific dealer from the microservice.
    Includes sentiment analysis for each review.
    """
    try:
        url = f"{DEALER_SERVICE_URL}/fetchReviews/dealer/{dealer_id}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            reviews = response.json()
            
            # Add sentiment analysis to each review
            for review in reviews:
                if review.get('review'):
                    sentiment = analyze_review_sentiment(review['review'])
                    review['sentiment'] = sentiment
                else:
                    review['sentiment'] = 'neutral'
            
            return JsonResponse({"status": 200, "reviews": reviews})
        else:
            return JsonResponse({
                "status": response.status_code,
                "message": f"Error fetching reviews for dealer: {dealer_id}"
            }, status=response.status_code)
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def add_review(request):
    """
    Add a new review for a dealer.
    
    Expected POST data:
    {
        "dealer_id": int,
        "name": "string",
        "review": "string",
        "purchase": boolean,
        "purchase_date": "string",
        "car_make": "string",
        "car_model": "string",
        "car_year": int
    }
    """
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Prepare review data
            review_data = {
                "dealer_id": data.get('dealer_id'),
                "name": request.user.username,
                "review": data.get('review'),
                "purchase": data.get('purchase', False),
                "purchase_date": data.get('purchase_date', ''),
                "car_make": data.get('car_make', ''),
                "car_model": data.get('car_model', ''),
                "car_year": data.get('car_year', 0)
            }
            
            # Post to microservice
            url = f"{DEALER_SERVICE_URL}/insertReview"
            response = requests.post(url, json=review_data, timeout=10)
            
            if response.status_code == 200 or response.status_code == 201:
                return JsonResponse({"status": 200, "message": "Review posted successfully"})
            else:
                return JsonResponse({
                    "status": response.status_code,
                    "message": "Error posting review"
                }, status=response.status_code)
                
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.error(f"Error adding review: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)


# ==================== Sentiment Analysis ====================

def analyze_sentiment(request, review_text):
    """
    Analyze the sentiment of a review text.
    """
    try:
        sentiment = analyze_review_sentiment(review_text)
        return JsonResponse({
            "status": 200,
            "review": review_text,
            "sentiment": sentiment
        })
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


# ==================== Template Views ====================

def dealer_list_view(request):
    """
    Render the dealer list template.
    """
    try:
        url = f"{DEALER_SERVICE_URL}/fetchDealers"
        response = requests.get(url, timeout=10)
        dealers = response.json() if response.status_code == 200 else []
        
        return render(request, 'djangoapp/dealer_list.html', {
            'dealers': dealers
        })
    except Exception as e:
        logger.error(f"Error in dealer list view: {str(e)}")
        return render(request, 'djangoapp/dealer_list.html', {
            'dealers': [],
            'error': str(e)
        })


def dealer_details_view(request, dealer_id):
    """
    Render the dealer details template with reviews.
    """
    try:
        # Fetch dealer
        dealer_url = f"{DEALER_SERVICE_URL}/fetchDealer/{dealer_id}"
        dealer_response = requests.get(dealer_url, timeout=10)
        dealer = dealer_response.json() if dealer_response.status_code == 200 else None
        
        # Fetch reviews
        reviews_url = f"{DEALER_SERVICE_URL}/fetchReviews/dealer/{dealer_id}"
        reviews_response = requests.get(reviews_url, timeout=10)
        reviews = reviews_response.json() if reviews_response.status_code == 200 else []
        
        # Add sentiment to reviews
        for review in reviews:
            if review.get('review'):
                review['sentiment'] = analyze_review_sentiment(review['review'])
        
        return render(request, 'djangoapp/dealer_details.html', {
            'dealer': dealer,
            'reviews': reviews
        })
    except Exception as e:
        logger.error(f"Error in dealer details view: {str(e)}")
        return render(request, 'djangoapp/dealer_details.html', {
            'error': str(e)
        })


def add_review_view(request, dealer_id):
    """
    Render the add review template.
    """
    if not request.user.is_authenticated:
        return redirect('login')
    
    try:
        # Fetch dealer
        dealer_url = f"{DEALER_SERVICE_URL}/fetchDealer/{dealer_id}"
        dealer_response = requests.get(dealer_url, timeout=10)
        dealer = dealer_response.json() if dealer_response.status_code == 200 else None
        
        # Fetch car makes
        car_makes = CarMake.objects.prefetch_related('car_models').all()
        
        return render(request, 'djangoapp/add_review.html', {
            'dealer': dealer,
            'car_makes': car_makes
        })
    except Exception as e:
        logger.error(f"Error in add review view: {str(e)}")
        return render(request, 'djangoapp/add_review.html', {
            'error': str(e)
        })


@csrf_exempt
def submit_review_view(request, dealer_id):
    """
    Handle review form submission from template.
    """
    if not request.user.is_authenticated:
        return redirect('login')
    
    if request.method == 'POST':
        try:
            review_data = {
                "dealer_id": dealer_id,
                "name": request.user.username,
                "review": request.POST.get('review'),
                "purchase": request.POST.get('purchase') == 'on',
                "purchase_date": request.POST.get('purchase_date', ''),
                "car_make": request.POST.get('car_make', ''),
                "car_model": request.POST.get('car_model', ''),
                "car_year": int(request.POST.get('car_year', 0)) if request.POST.get('car_year') else 0
            }
            
            # Post to microservice
            url = f"{DEALER_SERVICE_URL}/insertReview"
            response = requests.post(url, json=review_data, timeout=10)
            
            if response.status_code in [200, 201]:
                return redirect('dealer_details', dealer_id=dealer_id)
            else:
                return render(request, 'djangoapp/review_submission.html', {
                    'status': 'error',
                    'message': 'Failed to submit review'
                })
        except Exception as e:
            logger.error(f"Error submitting review: {str(e)}")
            return render(request, 'djangoapp/review_submission.html', {
                'status': 'error',
                'message': str(e)
            })
    
    return redirect('add_review', dealer_id=dealer_id)
