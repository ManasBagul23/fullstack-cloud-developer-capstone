import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Spinner, Alert } from 'react-bootstrap';
import './Dealers.css';

/**
 * Dealers Component
 * 
 * Displays a list of all car dealerships with search/filter functionality.
 * Shows dealer information including:
 * - Dealer ID
 * - Dealer Name
 * - City
 * - Address
 * - Zip
 * - State
 */
function Dealers() {
  // Data state
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  
  // Get unique states for filter dropdown
  const states = [...new Set(dealers.map(d => d.state))].sort();
  
  /**
   * Fetch dealers on component mount
   */
  useEffect(() => {
    fetchDealers();
  }, []);
  
  /**
   * Filter dealers when search term or state filter changes
   */
  useEffect(() => {
    let filtered = dealers;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(dealer => 
        dealer.full_name.toLowerCase().includes(term) ||
        dealer.short_name.toLowerCase().includes(term) ||
        dealer.city.toLowerCase().includes(term) ||
        dealer.address.toLowerCase().includes(term)
      );
    }
    
    // Apply state filter
    if (stateFilter) {
      filtered = filtered.filter(dealer => dealer.state === stateFilter);
    }
    
    setFilteredDealers(filtered);
  }, [searchTerm, stateFilter, dealers]);
  
  /**
   * Fetch dealers from API
   */
  const fetchDealers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/djangoapp/get_dealers');
      const data = await response.json();
      
      if (data.status === 200 && data.dealers) {
        setDealers(data.dealers);
        setFilteredDealers(data.dealers);
      } else {
        setError('Failed to load dealers');
      }
    } catch (err) {
      console.error('Error fetching dealers:', err);
      setError('An error occurred while loading dealers');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Handle state filter change
   */
  const handleStateFilter = async (state) => {
    setStateFilter(state);
    
    if (state) {
      try {
        const response = await fetch(`/djangoapp/get_dealers/${state}`);
        const data = await response.json();
        
        if (data.status === 200 && data.dealers) {
          setFilteredDealers(data.dealers);
        }
      } catch (err) {
        console.error('Error filtering by state:', err);
      }
    } else {
      setFilteredDealers(dealers);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Container className="py-5">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading dealers...</span>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">Car Dealerships</h1>
      
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {/* Search and Filter Bar */}
      <Row className="mb-4 search-bar">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="Search dealers by name, city, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={stateFilter}
            onChange={(e) => handleStateFilter(e.target.value)}
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      
      {/* Results Count */}
      <p className="text-muted mb-3">
        Showing {filteredDealers.length} of {dealers.length} dealers
        {stateFilter && ` in ${stateFilter}`}
      </p>
      
      {/* Dealers Grid */}
      {filteredDealers.length === 0 ? (
        <Alert variant="info">
          No dealers found matching your criteria.
        </Alert>
      ) : (
        <Row>
          {filteredDealers.map(dealer => (
            <Col key={dealer.id} lg={4} md={6} className="mb-4">
              <Link to={`/dealer/${dealer.id}`} className="text-decoration-none">
                <Card className="dealer-card h-100">
                  <Card.Body>
                    <div className="dealer-id-badge">#{dealer.id}</div>
                    <Card.Title>{dealer.full_name}</Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">
                      {dealer.short_name}
                    </Card.Subtitle>
                    <div className="dealer-info-grid">
                      <div className="info-row">
                        <span className="info-label">City:</span>
                        <span className="info-value">{dealer.city}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">State:</span>
                        <span className="info-value">{dealer.state}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Address:</span>
                        <span className="info-value">{dealer.address}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Zip:</span>
                        <span className="info-value">{dealer.zip}</span>
                      </div>
                    </div>
                  </Card.Body>
                  <Card.Footer className="text-center">
                    <small className="text-primary">View Details & Reviews →</small>
                  </Card.Footer>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Dealers;
