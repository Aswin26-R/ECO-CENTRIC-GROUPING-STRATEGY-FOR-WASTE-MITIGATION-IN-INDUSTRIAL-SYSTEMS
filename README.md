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
       ↓
Environmental Note
