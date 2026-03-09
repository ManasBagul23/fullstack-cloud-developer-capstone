# xrwvm-fullstack_developer_capstone

## Project Name: fullstack_developer_capstone

A comprehensive Dealer Review Application built as part of the IBM Full Stack Developer Professional Certificate Capstone Project.

## 🚗 Project Overview

This application allows users to browse car dealerships, read reviews, and submit their own reviews with sentiment analysis capabilities.

### Architecture

- **Backend**: Django REST Framework
- **Microservice**: Express.js + MongoDB for dealer reviews
- **Frontend**: React.js with Bootstrap styling
- **Sentiment Analysis**: Custom sentiment analysis API
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
xrwvm-fullstack_developer_capstone/
│
├── server/
│   ├── djangoapp/              # Django application
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API views
│   │   ├── urls.py             # URL routing
│   │   ├── sentiment_analyzer.py
│   │   └── settings.py         # Django settings
│   │
│   ├── djangoproj/             # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   │
│   └── frontend/
│       ├── static/
│       │   ├── About.html
│       │   └── Contact.html
│       │
│       └── src/components/
│           ├── Register/Register.jsx
│           ├── Login/Login.jsx
│           ├── Dealers/Dealers.jsx
│           └── Reviews/Reviews.jsx
│
├── server/microservices/       # Express microservice
│   ├── app.js
│   ├── package.json
│   └── models/
│       ├── dealer.js
│       └── review.js
│
├── database/
│   └── dealers.json            # Seed data
│
├── README.md
├── docker-compose.yml
├── Dockerfile
└── .github/workflows/cicd.yml
```

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 16+
- MongoDB
- Docker & Docker Compose (optional)

### Backend Setup (Django)

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Microservice Setup (Express + MongoDB)

```bash
# Navigate to microservices directory
cd server/microservices

# Install dependencies
npm install

# Start MongoDB (if not running)
mongod

# Seed the database
node seedData.js

# Start the microservice
npm start
```

### Frontend Setup (React)

```bash
# Navigate to frontend directory
cd server/frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Docker Setup (Recommended)

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 🔌 API Endpoints

### Django Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/djangoapp/login` | POST | User login |
| `/djangoapp/logout` | GET | User logout |
| `/djangoapp/register` | POST | User registration |
| `/djangoapp/get_cars` | GET | Get all car makes/models |
| `/djangoapp/analyze/<review>` | GET | Analyze review sentiment |
| `/djangoapp/get_dealers` | GET | Get all dealers |
| `/djangoapp/get_dealers/<state>` | GET | Get dealers by state |
| `/djangoapp/dealer/<dealer_id>` | GET | Get dealer details |
| `/djangoapp/reviews/dealer/<dealer_id>` | GET | Get dealer reviews |
| `/djangoapp/add_review` | POST | Add a new review |

### Express Microservice Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/fetchDealers` | GET | Fetch all dealers |
| `/fetchDealer/<dealer_id>` | GET | Fetch dealer by ID |
| `/fetchDealers/state/<state>` | GET | Fetch dealers by state |
| `/fetchReviews/dealer/<dealer_id>` | GET | Fetch reviews by dealer |
| `/insertReview` | POST | Insert a new review |

## 📊 Data Models

### Dealer Object

```json
{
  "id": 1,
  "short_name": "ABC Motors",
  "full_name": "ABC Motors Dealership",
  "city": "New York",
  "state": "NY",
  "address": "123 Main Street",
  "zip": "10001",
  "lat": 40.7128,
  "long": -74.0060
}
```

### Review Object

```json
{
  "id": 1,
  "dealer_id": 1,
  "name": "John Doe",
  "review": "Great experience buying my new car!",
  "purchase": true,
  "purchase_date": "2024-01-15",
  "car_make": "Toyota",
  "car_model": "Camry",
  "car_year": 2024
}
```

## 🚀 Deployment Instructions

### Local Deployment

1. Clone the repository
2. Follow the setup instructions above
3. Access the application at `http://localhost:3000`

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Cloud Deployment (IBM Cloud / Kubernetes)

1. Build Docker images and push to container registry
2. Create Kubernetes deployment files
3. Apply deployments to cluster

```bash
# Push to registry
docker tag dealership-app:latest us.icr.io/<namespace>/dealership-app:latest
docker push us.icr.io/<namespace>/dealership-app:latest

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## 🧪 Testing

### Run Django Tests

```bash
cd server
python manage.py test djangoapp
```

### Run Frontend Tests

```bash
cd server/frontend
npm test
```

### API Testing with curl

See `curl_tests.md` for comprehensive API testing commands.

## 👥 Team Members

- **John Smith** - Full Stack Developer - john.smith@email.com
- **Jane Doe** - Backend Developer - jane.doe@email.com
- **Mike Johnson** - Frontend Developer - mike.johnson@email.com
- **Sarah Wilson** - DevOps Engineer - sarah.wilson@email.com

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🙏 Acknowledgments

- IBM Skills Network
- Coursera
- All contributors and reviewers
