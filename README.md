# ♻️ Steel Waste Management
## ECO-CENTRIC GROUPING STRATEGY FOR WASTE MITIGATION IN INDUSTRIAL SYSTEMS

### Pre-Waste Analytics for Industrial Steel Waste Prediction

A full-stack machine-learning application designed to predict potential steel-industry waste **before it is generated**.

The system accepts upcoming production and raw-material details, analyzes them using a **Linear Discriminant Analysis (LDA)** machine-learning model, and provides:

- 🔍 Predicted waste type
- ♻️ Waste category
- 📊 Confidence score
- 🚨 Priority level
- 🛠️ Recommended action
- 📋 Waste-management recommendation
- 🌱 Environmental impact note

The main goal is to move industrial waste management from a **reactive post-production process** toward a **proactive pre-waste prediction system**.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Existing System](#-existing-system)
- [Proposed System](#-proposed-system)
- [Objectives](#-objectives)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Machine Learning Algorithm](#-machine-learning-algorithm)
- [ML Pipeline](#-ml-pipeline)
- [Model Evaluation](#-model-evaluation)
- [System Architecture](#-system-architecture)
- [Application Workflow](#-application-workflow)
- [Database Structure](#-database-structure)
- [Dataset](#-dataset)
- [Installation](#-installation)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Database Setup](#-database-setup)
- [Environment Variables](#-environment-variables)
- [How to Run](#-how-to-run)
- [Demo Login](#-demo-login)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Limitations](#-limitations)
- [Future Enhancements](#-future-enhancements)
- [Screenshots](#-screenshots)
- [Academic Project Note](#-academic-project-note)
- [License](#-license)

---

# 📌 Project Overview

Traditional industrial waste auditing can involve manual inspection and post-production analysis. This process can be time-consuming and may introduce human error.

The proposed system allows users to enter production and raw-material information **before manufacturing begins** and receive an estimated waste classification and management recommendation.

### Basic Workflow

```text
Production Data
       ↓
Raw Material Data
       ↓
Data Preprocessing
       ↓
Machine Learning Model
       ↓
Waste Classification
       ↓
Confidence Score
       ↓
Priority Calculation
       ↓
Waste Category
       ↓
Management Recommendation

# Eco-Centric Grouping Strategy for Waste Mitigation in Industrial Systems

An academic full-stack prototype for **pre-waste management in the steel industry**. Instead of
auditing waste *after* it is generated (the traditional 7–10 day process), this system analyzes
upcoming production and raw-material information, predicts the likely waste type using a
**Linear Discriminant Analysis (LDA)** model, and recommends a management strategy —
recycle, reuse, treat, or dispose — before production even starts.

> This README, the dataset, the exact features, and the recommendation rules are documented
> below as **prototype implementation choices**. The source project document specifies the
> problem, the existing/proposed system, and the LDA algorithm, but does not specify an exact
> dataset, feature set, database schema, UI, or API — those are implementation decisions made to
> produce a runnable, demonstrable college-level project, not facts claimed from the source paper.

---

## Overview

| | |
|---|---|
| **Problem** | Manual, post-production waste auditing is slow (7–10 days), costly, and error-prone. |
| **Approach** | Predict waste type from planned production/raw-material inputs *before* waste is generated. |
| **Algorithm** | Linear Discriminant Analysis (`sklearn.discriminant_analysis.LinearDiscriminantAnalysis`) |
| **Stack** | React + Vite + Tailwind · Flask REST API · scikit-learn · MySQL |

## Problem Statement

Existing steel-industry waste auditing is manual, slow, and prone to human error. Different
waste types (solid, liquid, hazardous) generated at various production stages are often handled
reactively, increasing environmental risk and cost.

## Existing System (and its disadvantages)

- Manual, labor-intensive waste auditing that can take 7–10 days.
- Prone to human error.
- Slow to identify the correct disposal process.
- Risk of mixing different waste types before proper classification.

## Proposed System (this prototype)

A pre-waste management system that classifies the likely waste type from planned production
data using LDA, then applies a recommendation layer to suggest the appropriate management
strategy — proactively, before waste exists.

## Objectives

1. Predict the waste type likely to result from a planned production run.
2. Classify the predicted waste into a category (Recyclable / Reusable / Hazardous / Treatable).
3. Recommend a concrete management action with an environmental-impact note.
4. Provide prediction confidence and a browsable/searchable prediction history.
5. Present the above through a modern, responsive analytics dashboard.

## Features

- Login (with a one-click demo account).
- Dashboard with stat cards, three charts (waste-type distribution, recommendation
  distribution, predictions-over-time), and a recent-predictions table.
- Multi-section prediction form with validation, tooltips, and dropdowns.
- Result page with predicted waste type, category, priority, confidence, and recommended action.
- Searchable, filterable, paginated prediction history with delete + full detail view.
- About page describing the project, problem, existing/proposed systems, and stack.
- Friendly error handling and empty states throughout; no raw stack traces shown to users.

## Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Axios, React Router, Lucide React, Recharts
- **Backend:** Python, Flask, Flask-CORS, REST API
- **ML:** scikit-learn (Linear Discriminant Analysis), pandas, NumPy
- **Database:** MySQL via SQLAlchemy (`mysql-connector-python` driver)

## ML Algorithm

The project document specifies a Linear Discriminant Algorithm — this prototype uses
`LinearDiscriminantAnalysis` from scikit-learn exclusively (no substitution with random forest,
XGBoost, or neural networks).

**Pipeline** (`backend/train_model.py`):

```
Demo dataset (synthetic, generated by the script)
   -> Data cleaning (drop na / duplicates)
   -> Feature selection (4 categorical + 2 numeric columns)
   -> One-hot encoding (categoricals) + standard scaling (numeric)
   -> Train/test split (80/20, stratified)
   -> Linear Discriminant Analysis
   -> Evaluation (accuracy, precision, recall, F1, confusion matrix)
   -> Save model + encoders + scaler (saved_models/lda_model.pkl)
   -> Flask prediction API -> React frontend
```

### Model Evaluation (on the bundled demo dataset)

| Metric | Score |
|---|---|
| Accuracy | 0.5125 |
| Precision (weighted) | 0.4942 |
| Recall (weighted) | 0.5125 |
| F1-score (weighted) | 0.4819 |

8-class classification (random-guess baseline ≈ 0.125), evaluated on a 240-row held-out test
split from 1,200 synthetic rows. The full confusion matrix is written to
`backend/saved_models/metrics.json` after training and is also served at
`GET /api/dashboard/model-metrics`. Accuracy is intentionally imperfect: a small amount of label
noise (~6%) was added to the synthetic dataset so the classroom demonstration reflects a
realistic, non-trivially-separable classification problem rather than a memorized lookup table.

## System Architecture

```
React (Vite/Tailwind) --REST/JSON--> Flask API --SQLAlchemy--> MySQL
                                         |
                                         +--> LDA model (saved_models/lda_model.pkl)
                                         +--> Recommendation service (rule-based)
```

## Database Structure

Two tables (see `database/database.sql`):

- **users** — `id, name, email, password_hash, created_at`
- **predictions** — `id, user_id, production_process, raw_material, production_quantity,
  material_quantity, process_stage, material_category, predicted_waste_type, waste_category,
  action, confidence, priority, recommendation, environmental_note, created_at`

The Flask app also auto-creates these tables via `db.create_all()` on first run and seeds a demo
login account, so `database.sql` is optional for a quick local run but recommended for reviewing
or provisioning the schema directly.

## Dataset Explanation

**Demo / Sample Dataset for Academic Prototype** — `backend/dataset/steel_waste_dataset.csv`
(1,200 rows, generated by `train_model.py` on first run if the file doesn't already exist).

The source document does not provide an actual dataset, so this is a synthetically generated,
clearly-labeled demo dataset built around a plausible steel-industry process → waste-type
relationship (e.g. Electric Arc Furnace melting is weighted toward EAF Dust; Basic Oxygen
Furnace toward Blast Furnace Slag; Galvanizing toward Zinc Ash), with random noise so it is not
perfectly separable. **This is not real industrial measurement data and must not be presented as
such.**

Columns: `production_process, raw_material, process_stage, material_category,
production_quantity, material_quantity, waste_type`.

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8+ (or use the SQLite fallback below for a zero-setup demo)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt

cp .env.example .env         # then edit DB credentials
python train_model.py        # generates dataset + trains + saves the LDA model
python app.py                # starts the API on http://localhost:5000
```

> **Quick demo without MySQL:** set `USE_SQLITE=true` in `backend/.env` to run against a local
> SQLite file instead of MySQL. This is provided purely for instant local demonstration; the
> project's documented database is MySQL.

### Frontend

```bash
cd frontend
npm install
npm run dev                  # starts on http://localhost:5173
```

### Database (MySQL)

```bash
mysql -u root -p < database/database.sql
```

## Environment Variables

`backend/.env.example`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=steel_waste_management
DB_USER=root
DB_PASSWORD=your_password

FLASK_ENV=development
SECRET_KEY=change-this-secret-key-in-production
FRONTEND_URL=http://localhost:5173
```

Optional frontend override (`frontend/.env`): `VITE_API_URL=http://localhost:5000/api`

## How to Run

1. Start MySQL (or set `USE_SQLITE=true`).
2. `cd backend && python train_model.py` (once, to generate the dataset + model).
3. `cd backend && python app.py`
4. `cd frontend && npm run dev`
5. Open `http://localhost:5173`, click **Use Demo Login** (or `demo@steelwaste.io` /
   `demo1234`), and run a prediction from the **New Prediction** page.

## API Documentation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Log in with email/password |
| POST | `/api/predictions/predict` | Run an LDA prediction without saving it |
| POST | `/api/predictions` | Run a prediction and save it to the database |
| GET | `/api/predictions` | List predictions (`search`, `category`, `page`, `per_page`) |
| GET | `/api/predictions/<id>` | Get one prediction |
| DELETE | `/api/predictions/<id>` | Delete a prediction |
| GET | `/api/dashboard/stats` | Stat-card totals |
| GET | `/api/dashboard/charts` | Chart data (waste-type / recommendation / time series) |
| GET | `/api/dashboard/model-metrics` | LDA evaluation metrics |

Example response from `POST /api/predictions`:

```json
{
  "success": true,
  "prediction": {
    "id": 1,
    "predicted_waste_type": "EAF Dust",
    "waste_category": "Hazardous",
    "action": "Treatment",
    "confidence": 0.9949,
    "priority": "High",
    "recommendation": "Store in sealed containers and route to a licensed hazardous-waste processor for zinc/metal recovery.",
    "environmental_note": "EAF dust can contain heavy metals; improper handling poses a serious environmental and health risk."
  }
}
```

## Limitations

- The dataset is synthetic and does not represent measured industrial data.
- The recommendation rules are a fixed, rule-based mapping (documented in
  `backend/services/recommendation_service.py`), not learned from data.
- Authentication is simplified for academic demonstration (a single demo account, no password
  reset / registration flow, no JWT/session expiry).
- Not validated against real steel-plant production or waste-audit records.

## Future Enhancements

- Train on real production and waste-audit data once available.
- Extend toward the multi-view / semi-supervised classification direction discussed in the
  source project document.
- Replace the static recommendation rule table with a configurable or learned rule engine.
- Add user registration and role-based access (operator vs. environmental officer).

## Screenshots

Run the app locally and visit the Dashboard, Prediction, Result, History, and About pages —
screenshots were not generated for this prototype submission.

---

## Project Structure

```
steel-waste-management/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── train_model.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   ├── database_models.py
│   │   └── ml_model.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── prediction_routes.py
│   │   └── dashboard_routes.py
│   ├── services/
│   │   ├── prediction_service.py
│   │   └── recommendation_service.py
│   ├── dataset/steel_waste_dataset.csv
│   └── saved_models/lda_model.pkl
├── frontend/
│   └── src/
│       ├── components/  (Navbar, Sidebar, StatCard, PredictionForm, PredictionResult, DataTable, ChartCard, LoadingSpinner)
│       ├── pages/        (Login, Dashboard, Prediction, Result, History, Details, About)
│       ├── services/api.js
│       ├── context/AuthContext.jsx
│       ├── App.jsx
│       └── main.jsx
├── database/database.sql
└── README.md
```
