# 🌱 AgriSmart AI

[![CI/CD Pipeline](https://github.com/akshayahirrao1/agrismart-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/akshayahirrao1/agrismart-ai/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://agrismart-ai-livid.vercel.app/)

AgriSmart AI is a comprehensive, full-stack AI-powered Smart Agriculture System designed to empower farmers with data-driven insights. It leverages Machine Learning models to optimize crop selection, predict soil moisture levels, and detect plant diseases—ultimately aiming to increase yield and promote sustainable farming practices.

## ✨ Features

- 🌾 **Crop Recommendation:** Suggests the most suitable crop based on soil metrics (N, P, K, pH) and environmental factors (temperature, humidity, rainfall).
- 💧 **Soil Moisture Prediction:** Forecasts soil moisture levels and provides smart irrigation suggestions.
- 🍃 **Plant Disease Detection:** Identifies plant diseases from leaf images using advanced computer vision models.
- 🌤️ **Live Weather Updates:** Integrates real-time weather data to assist in agricultural planning.
- 🔐 **Secure Authentication:** Robust user authentication and role management using JWT.
- 🚀 **Fully Automated CI/CD:** Automated testing (Vitest, Supertest) and deployment using GitHub Actions, Vercel, and Render.

## 🛠️ Technology Stack

**Frontend (Client)**
- React (Vite)
- TypeScript
- Tailwind CSS & shadcn/ui
- React Router & React Context API

**Backend (Node API)**
- Node.js & Express.js
- MongoDB Atlas & Mongoose
- JSON Web Tokens (JWT) & bcrypt

**Machine Learning Service (Python)**
- Python 3.11
- Flask & Flask-CORS
- Scikit-Learn, Pandas, NumPy
- Gunicorn

## 🏗️ System Architecture

AgriSmart AI employs a microservice-inspired architecture:
1. **Frontend Application:** Hosts the interactive user interface and manages state. Communicates securely with the Node.js API.
2. **Node.js Backend:** Acts as the primary gateway. It handles user authentication, data persistence, and routes complex prediction requests to the ML Service.
3. **Python ML Service:** A dedicated, lightweight Flask API that hosts and executes pre-trained Scikit-Learn (`.pkl`) models for near real-time predictions.

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v20+)
- Python (v3.11+)
- MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/akshayahirrao1/agrismart-ai.git
cd agrismart-ai
```

### 2. Setup the ML Service (Python)
Open a terminal and start the Flask service:
```bash
cd backend/ml_service
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.prod.txt
python app.py
```
*The ML service will run on `http://localhost:8000`*

### 3. Setup the Node Backend
Open a second terminal for the Express API:
```bash
cd backend
npm install

# Create a .env file based on .env.example and populate your keys
npm run dev
```
*The Node API will run on `http://localhost:5000`*

### 4. Setup the Frontend
Open a third terminal for the React app:
```bash
# From the root directory
npm install

# Create a .env file and set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```
*The Frontend will run on `http://localhost:5173`*

## 🧪 Testing

The project uses `vitest` for both frontend and backend testing.

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd ..
npm test
```

## 🌐 Deployment

The system is configured for automated CI/CD:
- **Frontend:** Deployed on Vercel.
- **Node Backend & ML Service:** Dockerized and deployed as separate Web Services on Render.
- **Pipeline:** GitHub Actions runs linting, tests, and Docker build verifications on every PR. Merging to `main` triggers auto-deployment.

## 👨‍💻 Author & Contact

**Akshay Ahirrao**
- 📧 Email: [akshayahirrao103@gmail.com](mailto:akshayahirrao103@gmail.com)
- 🐙 GitHub: [@akshayahirrao1](https://github.com/akshayahirrao1)
- 💼 LinkedIn: [Akshay Ahirrao](https://www.linkedin.com/in/akshay-ahirrao-72554032a)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
