import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import './DealerDetails.css';

/**
 * DealerDetails Component
 * 
 * Displays detailed information about a specific dealer and their reviews.
 * Includes sentiment analysis visualization for each review.
 */
function DealerDetails({ isLoggedIn }) {
  const { id } = useParams();
  
  // Data state
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // UI state
  const [loadingDealer, setLoadingDealer] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState('');
  
  /**
   * Fetch dealer and reviews on component mount
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
      setLoadingDealer(true);
      const response = await fetch(`/djangoapp/dealer/${id}`);
      const data = await response.json();
      
      if (data.status === 200 && data.dealer) {
        setDealer(data.dealer);
      } else {
        setError('Dealer not found');
      }
    } catch (err) {
      console.error('Error fetching dealer:', err);
      setError('Failed to load dealer details');
    } finally {
      setLoadingDealer(false);
    }
  };
  
  /**
   * Fetch dealer reviews
   */
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`/djangoapp/reviews/dealer/${id}`);
      const data = await response.json();
      
      if (data.status === 200 && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };
  
  /**
   * Get sentiment badge variant
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
   * Get sentiment icon
   */
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };
  
  // Loading state
  if (loadingDealer) {
    return (
      <Container className="py-5">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading dealer details...</span>
        </div>
      </Container>
    );
  }
  
  // Error state
  if (error && !dealer) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Link to="/dealers" className="btn btn-primary">
            Back to Dealers
          </Link>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      {/* Back Button */}
      <Link to="/dealers" className="btn btn-outline-secondary mb-4">
        ← Back to Dealers
      </Link>
      
      {dealer && (
        <>
          {/* Dealer Information Card */}
          <Card className="dealer-details-card mb-4">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h2 className="dealer-name">{dealer.full_name}</h2>
                  <p className="dealer-short-name text-muted">{dealer.short_name}</p>
                </Col>
                <Col md={4} className="text-md-end">
                  <Badge bg="primary" className="dealer-id-badge-large">
                    Dealer ID: {dealer.id}
                  </Badge>
                </Col>
              </Row>
              
              <hr />
              
              <Row className="dealer-info-details">
                <Col md={6}>
                  <div className="info-item">
                    <strong>📍 Address</strong>
                    <span>{dealer.address}</span>
                  </div>
                  <div className="info-item">
                    <strong>🏙️ City</strong>
                    <span>{dealer.city}</span>
                  </div>
                  <div className="info-item">
                    <strong>🗺️ State</strong>
                    <span>{dealer.state}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="info-item">
                    <strong>📮 Zip Code</strong>
                    <span>{dealer.zip}</span>
                  </div>
                  <div className="info-item">
                    <strong>🌐 Coordinates</strong>
                    <span>{dealer.lat}, {dealer.long}</span>
                  </div>
                </Col>
              </Row>
              
              {/* Add Review Button */}
              {isLoggedIn ? (
                <Link 
                  to={`/dealer/${id}/add-review`} 
                  className="btn btn-primary mt-3"
                >
                  ✍️ Write a Review
                </Link>
              ) : (
                <div className="mt-3">
                  <Alert variant="info" className="mb-0">
                    <Link to="/login">Login</Link> to write a review for this dealer.
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {/* Reviews Section */}
          <h3 className="mb-4">
            Customer Reviews ({reviews.length})
          </h3>
          
          {loadingReviews ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <span className="ms-2">Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <Alert variant="info">
              No reviews yet. Be the first to review this dealer!
            </Alert>
          ) : (
            <Row>
              {reviews.map((review, index) => (
                <Col key={review.id || index} lg={6} className="mb-4">
                  <Card className="review-card h-100">
                    <Card.Body>
                      <div className="review-header">
                        <div className="reviewer-info">
                          <h5 className="reviewer-name">{review.name}</h5>
                          {review.purchase_date && (
                            <small className="text-muted">
                              Purchased on {review.purchase_date}
                            </small>
                          )}
                        </div>
                        <div className="sentiment-indicator">
                          <span className="sentiment-icon">
                            {getSentimentIcon(review.sentiment)}
                          </span>
                          <Badge bg={getSentimentColor(review.sentiment)}>
                            {review.sentiment || 'neutral'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="review-text">{review.review}</p>
                      
                      {review.purchase && review.car_make && (
                        <div className="car-info">
                          <Badge bg="light" text="dark">
                            🚗 {review.car_make} {review.car_model} ({review.car_year})
                          </Badge>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}

export default DealerDetails;
