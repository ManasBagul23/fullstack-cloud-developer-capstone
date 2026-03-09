import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dealers from './components/Dealers/Dealers';
import DealerDetails from './components/Dealers/DealerDetails';
import Reviews from './components/Reviews/Reviews';
import AddReview from './components/Reviews/AddReview';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from sessionStorage
    const storedUser = sessionStorage.getItem('userName');
    if (storedUser) {
      setIsLoggedIn(true);
      setUserName(storedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUserName(username);
    sessionStorage.setItem('userName', username);
  };

  const handleLogout = async () => {
    try {
      await fetch('/djangoapp/logout');
      setIsLoggedIn(false);
      setUserName('');
      sessionStorage.removeItem('userName');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/logo.png"
              alt="Logo"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            Dealership Review
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/dealers">Dealers</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <>
                  <Navbar.Text className="me-3">
                    Welcome, <strong>{userName}</strong>
                  </Navbar.Text>
                  <Button variant="outline-light" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/dealer/:id" element={<DealerDetails isLoggedIn={isLoggedIn} />} />
          <Route path="/dealer/:id/reviews" element={<Reviews />} />
          <Route path="/dealer/:id/add-review" element={<AddReview isLoggedIn={isLoggedIn} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer bg-dark text-light py-4 mt-5">
        <Container>
          <div className="row">
            <div className="col-md-6">
              <h5>Dealership Review</h5>
              <p>Find the best car dealerships and read honest reviews.</p>
            </div>
            <div className="col-md-3">
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/dealers" className="text-light">Dealers</Link></li>
                <li><a href="/about" className="text-light">About Us</a></li>
                <li><a href="/contact" className="text-light">Contact</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Contact Us</h6>
              <p className="mb-1">Email: info@dealership.com</p>
              <p className="mb-1">Phone: (555) 123-4567</p>
            </div>
          </div>
          <hr />
          <p className="text-center mb-0">
            &copy; 2024 Dealership Review. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
}

// Home Component
function Home() {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4">Welcome to Dealership Review</h1>
        <p className="lead text-muted">
          Find trusted car dealerships and read authentic reviews from real customers.
        </p>
        <Link to="/dealers" className="btn btn-primary btn-lg">
          Browse Dealers
        </Link>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">🚗 Find Dealers</h3>
              <p className="card-text">
                Browse our extensive list of verified car dealerships across the country.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">⭐ Read Reviews</h3>
              <p className="card-text">
                Get insights from real customers about their experiences with dealers.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="card-title">📝 Share Experience</h3>
              <p className="card-text">
                Create an account and share your own dealership experience with others.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <h2>Why Choose Us?</h2>
        <p className="text-muted">
          We verify all reviews using advanced sentiment analysis to ensure authenticity.
        </p>
      </div>
    </Container>
  );
}

export default App;
