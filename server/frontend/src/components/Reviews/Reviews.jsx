import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Badge, Spinner, Alert, Row, Col } from 'react-bootstrap';
import './Reviews.css';

/**
 * Reviews Component
 * 
 * Displays all reviews for a specific dealer with sentiment analysis
 */
function Reviews() {
  const { id } = useParams();
  
  // Data state
  const [reviews, setReviews] = useState([]);
  const [dealer, setDealer] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  /**
   * Fetch reviews and dealer on component mount
   */
  useEffect(() => {
    fetchDealer();
    fetchReviews();
  }, [id]);
  
  /**
   * Fetch dealer details
   */
  const fetchDealer = async () => {
    try {
      const response = await fetch(`/djangoapp/dealer/${id}`);
      const data = await response.json();
      
      if (data.status === 200 && data.dealer) {
        setDealer(data.dealer);
      }
    } catch (err) {
      console.error('Error fetching dealer:', err);
    }
  };
  
  /**
   * Fetch reviews for dealer
   */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/djangoapp/reviews/dealer/${id}`);
      const data = await response.json();
      
      if (data.status === 200 && data.reviews) {
        setReviews(data.reviews);
      } else {
        setError('Failed to load reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('An error occurred while loading reviews');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get sentiment badge color
   */
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  
  /**
   * Get sentiment image path
   */
  const getSentimentImage = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '/static/sentiment_positive.png';
      case 'negative':
        return '/static/sentiment_negative.png';
      default:
        return '/static/sentiment_neutral.png';
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Container className="py-5">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading reviews...</span>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      {/* Back Link */}
      <Link to={`/dealer/${id}`} className="btn btn-outline-secondary mb-4">
        ← Back to Dealer
      </Link>
      
      {/* Header */}
      <div className="mb-4">
        <h2>Reviews for {dealer?.full_name || `Dealer #${id}`}</h2>
        <p className="text-muted">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      
      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Alert variant="info">
          No reviews available for this dealer yet.
        </Alert>
      ) : (
        <Row>
          {reviews.map((review, index) => (
            <Col key={review.id || index} md={6} className="mb-4">
              <Card className="review-card h-100">
                <Card.Body>
                  {/* Review Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="mb-1">{review.name}</h5>
                      {review.purchase_date && (
                        <small className="text-muted">
                          {review.purchase_date}
                        </small>
                      )}
                    </div>
                    <div className="sentiment-display">
                      <img 
                        src={getSentimentImage(review.sentiment)}
                        alt={review.sentiment}
                        className="sentiment-image"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <Badge bg={getSentimentColor(review.sentiment)}>
                        {review.sentiment || 'neutral'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Review Text */}
                  <p className="review-text">{review.review}</p>
                  
                  {/* Car Info */}
                  {review.purchase && review.car_make && (
                    <div className="car-purchase-info">
                      <Badge bg="light" text="dark" className="me-2">
                        🚗 {review.car_make}
                      </Badge>
                      {review.car_model && (
                        <Badge bg="light" text="dark" className="me-2">
                          {review.car_model}
                        </Badge>
                      )}
                      {review.car_year > 0 && (
                        <Badge bg="light" text="dark">
                          {review.car_year}
                        </Badge>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Reviews;
