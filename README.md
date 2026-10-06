# 🚚 ACE Logistics Application

ACE Logistics is a modern, full-stack enterprise logistics and package tracking platform built to streamline shipment creation, driver management, real-time tracking, and role-based operational workflows.

## 🔗 Live Deployments

* **Frontend Application:** https://ace-app-dusky.vercel.app
* **Backend API Base URL:** `http://localhost:5000/api` *(Development)* / Configurable via `.env`

## 🏗️ System Architecture & Tech Stack

The application follows a decoupled client-server architecture built using the **MERN** stack (MongoDB, Express, React, Node.js) with ES Modules (`type: "module"`).

```text
   ┌───────────────────────┐
   │ React Frontend        │ (Vercel)
   │ https://ace-app-...   │
   └───────────┬───────────┘
               │
               │ REST API / HTTP
               ▼
   ┌───────────────────────┐
   │ Express Node.js API   │ (Backend)
   │ Auth, Security, Routes│
   └───────────┬───────────┘
               │
               │ Mongoose ODM
               ▼
   ┌───────────────────────┐
   │ MongoDB Atlas         │ (Cloud Database)
   │ Collections & GeoJSON │
   └───────────────────────┘