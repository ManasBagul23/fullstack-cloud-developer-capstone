import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './Login.css';

/**
 * Login Component
 * 
 * Handles user authentication with username and password
 */
function Login({ onLogin }) {
  const navigate = useNavigate();
  
  // Form state
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!userName.trim() || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/djangoapp/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName,
          password: password
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 'Authenticated') {
        // Call parent login handler
        if (onLogin) {
          onLogin(userName);
        }
        // Redirect to home
        navigate('/');
      } else {
        setError(data.status || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <div className="auth-form login-form">
        <h2>Welcome Back</h2>
        <p className="text-muted text-center mb-4">
          Sign in to access your account
        </p>
        
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          {/* Username Field */}
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>
          
          {/* Password Field */}
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </Form.Group>
          
          {/* Login Button */}
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
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          
          {/* Register Link */}
          <p className="text-center mb-0">
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
