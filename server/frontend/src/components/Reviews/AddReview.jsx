import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import './AddReview.css';

/**
 * AddReview Component
 * 
 * Form for adding a new review for a dealer
 */
function AddReview({ isLoggedIn }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    review: '',
    purchase: false,
    purchase_date: '',
    car_make: '',
    car_model: '',
    car_year: ''
  });
  
  // Data state
  const [dealer, setDealer] = useState(null);
  const [carMakes, setCarMakes] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingDealer, setLoadingDealer] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  /**
   * Fetch dealer and car makes on mount
   */
  useEffect(() => {
    fetchDealer();
    fetchCarMakes();
  }, [id]);
  
  /**
   * Redirect if not logged in
   */
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  
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
   * Fetch car makes for dropdown
   */
  const fetchCarMakes = async () => {
    try {
      const response = await fetch('/djangoapp/get_cars');
      const data = await response.json();
      
      if (data.carMakes) {
        setCarMakes(data.carMakes);
      }
    } catch (err) {
      console.error('Error fetching car makes:', err);
    }
  };
  
  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.review.trim()) {
      setError('Please write a review');
      return;
    }
    
    if (formData.review.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/djangoapp/add_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealer_id: parseInt(id),
          review: formData.review,
          purchase: formData.purchase,
          purchase_date: formData.purchase_date,
          car_make: formData.car_make,
          car_model: formData.car_model,
          car_year: formData.car_year ? parseInt(formData.car_year) : 0
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 200) {
        setSuccess('Review submitted successfully!');
        setTimeout(() => {
          navigate(`/dealer/${id}`);
        }, 1500);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Loading state
  if (loadingDealer) {
    return (
      <Container className="py-5">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading...</span>
        </div>
      </Container>
    );
  }
  
  // Get models for selected make
  const selectedMake = carMakes.find(make => make.name === formData.car_make);
  const carModels = selectedMake ? selectedMake.models : [];
  
  // Generate year options (last 30 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  return (
    <Container className="py-4">
      {/* Back Link */}
      <Link to={`/dealer/${id}`} className="btn btn-outline-secondary mb-4">
        ← Back to Dealer
      </Link>
      
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="add-review-card">
            <Card.Body>
              <h2 className="mb-2">Write a Review</h2>
              {dealer && (
                <p className="text-muted mb-4">
                  Share your experience with {dealer.full_name}
                </p>
              )}
              
              {/* Error Alert */}
              {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                  {error}
                </Alert>
              )}
              
              {/* Success Alert */}
              {success && (
                <Alert variant="success">
                  {success}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                {/* Review Text */}
                <Form.Group className="mb-4" controlId="review">
                  <Form.Label>Your Review *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="review"
                    placeholder="Write about your experience with this dealership..."
                    value={formData.review}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <Form.Text className="text-muted">
                    Minimum 10 characters
                  </Form.Text>
                </Form.Group>
                
                {/* Purchase Checkbox */}
                <Form.Group className="mb-4" controlId="purchase">
                  <Form.Check
                    type="checkbox"
                    name="purchase"
                    label="I purchased a car from this dealer"
                    checked={formData.purchase}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>
                
                {/* Car Details (shown if purchase is checked) */}
                {formData.purchase && (
                  <Card className="purchase-details-card mb-4">
                    <Card.Body>
                      <h6 className="mb-3">Purchase Details</h6>
                      <Row>
                        <Col md={6}>
                          {/* Purchase Date */}
                          <Form.Group className="mb-3" controlId="purchase_date">
                            <Form.Label>Purchase Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="purchase_date"
                              value={formData.purchase_date}
                              onChange={handleChange}
                              disabled={loading}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          {/* Car Year */}
                          <Form.Group className="mb-3" controlId="car_year">
                            <Form.Label>Car Year</Form.Label>
                            <Form.Select
                              name="car_year"
                              value={formData.car_year}
                              onChange={handleChange}
                              disabled={loading}
                            >
                              <option value="">Select year</option>
                              {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          {/* Car Make */}
                          <Form.Group className="mb-3" controlId="car_make">
                            <Form.Label>Car Make</Form.Label>
                            <Form.Select
                              name="car_make"
                              value={formData.car_make}
                              onChange={handleChange}
                              disabled={loading}
                            >
                              <option value="">Select make</option>
                              {carMakes.map(make => (
                                <option key={make.id} value={make.name}>
                                  {make.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          {/* Car Model */}
                          <Form.Group className="mb-3" controlId="car_model">
                            <Form.Label>Car Model</Form.Label>
                            <Form.Select
                              name="car_model"
                              value={formData.car_model}
                              onChange={handleChange}
                              disabled={loading || !formData.car_make}
                            >
                              <option value="">Select model</option>
                              {carModels.map(model => (
                                <option key={model.id} value={model.name}>
                                  {model.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
                
                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddReview;
