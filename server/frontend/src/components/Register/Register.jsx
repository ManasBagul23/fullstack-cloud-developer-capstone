import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './Register.css';

/**
 * Register Component
 * 
 * Handles user registration with the following fields:
 * - Username
 * - First Name
 * - Last Name
 * - Email
 * - Password
 */
function Register({ onLogin }) {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  /**
   * Validate form data
   */
  const validateForm = () => {
    if (!formData.userName.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.userName.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/djangoapp/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'Registered') {
        setSuccess('Registration successful! Redirecting...');
        // Call parent login handler
        if (onLogin) {
          onLogin(formData.userName);
        }
        // Redirect to home after short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else if (data.error === 'Already Registered') {
        setError('This username is already taken. Please choose another.');
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <div className="auth-form register-form">
        <h2>Create Account</h2>
        <p className="text-muted text-center mb-4">
          Join us to review and find the best car dealerships
        </p>
        
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
          {/* Username Field */}
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label>Username *</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              placeholder="Enter username"
              value={formData.userName}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <Form.Text className="text-muted">
              Must be at least 3 characters
            </Form.Text>
          </Form.Group>
          
          {/* First Name Field */}
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name *</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </Form.Group>
          
          {/* Last Name Field */}
          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name *</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </Form.Group>
          
          {/* Email Field */}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </Form.Group>
          
          {/* Password Field */}
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password *</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <Form.Text className="text-muted">
              Must be at least 6 characters
            </Form.Text>
          </Form.Group>
          
          {/* Confirm Password Field */}
          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Confirm Password *</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </Form.Group>
          
          {/* Register Button */}
          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
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
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
          
          {/* Login Link */}
          <p className="text-center mb-0">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </Form>
      </div>
    </Container>
  );
}

export default Register;
