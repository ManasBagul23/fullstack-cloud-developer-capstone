"""
Sentiment Analysis module for dealer reviews.

This module provides sentiment analysis capabilities for review text.
It can use either a local rule-based approach or an external API.
"""
import os
import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

# Get sentiment analyzer URL from settings or environment
SENTIMENT_API_URL = getattr(settings, 'SENTIMENT_ANALYZER_URL', 
                           os.environ.get('SENTIMENT_ANALYZER_URL', ''))

# Positive and negative word lists for local analysis
POSITIVE_WORDS = [
    'excellent', 'amazing', 'wonderful', 'fantastic', 'great', 'good',
    'awesome', 'outstanding', 'superb', 'terrific', 'brilliant', 'love',
    'loved', 'loving', 'perfect', 'best', 'happy', 'satisfied', 'pleased',
    'recommend', 'recommended', 'friendly', 'helpful', 'professional',
    'quick', 'fast', 'efficient', 'easy', 'smooth', 'pleasant', 'fair',
    'honest', 'trustworthy', 'comfortable', 'clean', 'beautiful', 'nice',
    'impressed', 'impressive', 'exceptional', 'positive', 'thank', 'thanks',
    'appreciate', 'appreciated', 'enjoyable', 'enjoyed', 'delighted'
]

NEGATIVE_WORDS = [
    'terrible', 'horrible', 'awful', 'bad', 'worst', 'poor', 'disappointing',
    'disappointed', 'frustrating', 'frustrated', 'annoying', 'annoyed',
    'angry', 'hate', 'hated', 'dislike', 'unpleasant', 'rude', 'unhelpful',
    'slow', 'delayed', 'wait', 'waited', 'overpriced', 'expensive', 'scam',
    'dishonest', 'pushy', 'aggressive', 'unprofessional', 'incompetent',
    'unreliable', 'broken', 'damaged', 'defective', 'problem', 'problems',
    'issue', 'issues', 'complaint', 'complain', 'avoid', 'never', 'wrong',
    'mistake', 'error', 'fail', 'failed', 'failure', 'regret', 'waste',
    'wasted', 'horrible', 'nasty', 'uncomfortable', 'dirty', 'messy'
]


def analyze_review_sentiment(review_text):
    """
    Analyze the sentiment of a review text.
    
    Args:
        review_text (str): The review text to analyze.
        
    Returns:
        str: One of 'positive', 'negative', or 'neutral'.
    """
    if not review_text:
        return 'neutral'
    
    # Try external API first if configured
    if SENTIMENT_API_URL:
        try:
            sentiment = analyze_with_api(review_text)
            if sentiment:
                return sentiment
        except Exception as e:
            logger.warning(f"External sentiment API failed, using local analysis: {e}")
    
    # Fall back to local analysis
    return analyze_locally(review_text)


def analyze_with_api(review_text):
    """
    Analyze sentiment using an external API.
    
    Args:
        review_text (str): The review text to analyze.
        
    Returns:
        str or None: The sentiment result, or None if API fails.
    """
    try:
        url = f"{SENTIMENT_API_URL}/analyze/{review_text}"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            result = response.json()
            return result.get('sentiment', 'neutral')
        else:
            logger.warning(f"Sentiment API returned status {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Sentiment API request failed: {e}")
        return None


def analyze_locally(review_text):
    """
    Analyze sentiment using a local rule-based approach.
    
    This is a simple implementation that counts positive and negative
    words in the review text.
    
    Args:
        review_text (str): The review text to analyze.
        
    Returns:
        str: One of 'positive', 'negative', or 'neutral'.
    """
    if not review_text:
        return 'neutral'
    
    # Convert to lowercase for comparison
    text_lower = review_text.lower()
    
    # Count positive and negative words
    positive_count = sum(1 for word in POSITIVE_WORDS if word in text_lower)
    negative_count = sum(1 for word in NEGATIVE_WORDS if word in text_lower)
    
    # Determine sentiment based on counts
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        return 'neutral'


def get_sentiment_score(review_text):
    """
    Get a numerical sentiment score for a review.
    
    Args:
        review_text (str): The review text to analyze.
        
    Returns:
        float: A score between -1 (very negative) and 1 (very positive).
    """
    if not review_text:
        return 0.0
    
    text_lower = review_text.lower()
    
    # Count words
    positive_count = sum(1 for word in POSITIVE_WORDS if word in text_lower)
    negative_count = sum(1 for word in NEGATIVE_WORDS if word in text_lower)
    
    total = positive_count + negative_count
    if total == 0:
        return 0.0
    
    # Calculate normalized score
    score = (positive_count - negative_count) / total
    return round(score, 2)


def get_sentiment_details(review_text):
    """
    Get detailed sentiment analysis for a review.
    
    Args:
        review_text (str): The review text to analyze.
        
    Returns:
        dict: Detailed analysis including sentiment, score, and matched words.
    """
    if not review_text:
        return {
            'sentiment': 'neutral',
            'score': 0.0,
            'positive_words': [],
            'negative_words': []
        }
    
    text_lower = review_text.lower()
    
    # Find matched words
    matched_positive = [word for word in POSITIVE_WORDS if word in text_lower]
    matched_negative = [word for word in NEGATIVE_WORDS if word in text_lower]
    
    # Calculate score
    score = get_sentiment_score(review_text)
    
    # Determine sentiment
    sentiment = analyze_locally(review_text)
    
    return {
        'sentiment': sentiment,
        'score': score,
        'positive_words': matched_positive,
        'negative_words': matched_negative
    }
