# 🎟️ Event Ticketing Platform

> A full-stack event management and ticketing web application built for the HY-360 Databases course at the University of Crete.

## 📌 Overview

This platform connects **Organizers** (who create and manage events) with **Customers** (who browse, book, and pay for tickets). It features real-time seat availability, payment simulation via virtual cards, reservation management, and revenue analytics for organizers.

## ✨ Features

### For Customers

- Register / Login
- Browse all available events
- Book Normal or VIP tickets
- Pay via virtual card (balance-based simulation)
- View and cancel reservations (with automatic refund)
- Filter reservations by date range
- See the most popular event

### For Organizers

- Login with pre-registered credentials
- Create events with VIP and Normal ticket tiers
- View all events and their revenue
- Delete events (automatically refunds all customers)
- Revenue breakdown: VIP vs Normal seats, per event

## 🛠️ Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Backend  | Node.js, Express.js         |
| Database | MySQL (MySQL Workbench 8.0) |
| Frontend | HTML, CSS, JavaScript       |
| ORM      | Raw SQL via `mysql2`        |
| Runtime  | Node.js v22.11.0+           |

## 🗄️ Database Design

The relational schema follows **3rd Normal Form (3NF)** with 6 entities:

- `Customer` — registered users
- `Organizer` — event creators (pre-seeded, cannot self-register for security)
- `Event` — events with VIP/Normal ticket tiers and capacity
- `Ticket` — individual seats linked to an event
- `Reservation` — a customer's booking of one or more tickets
- `Card` — virtual payment card linked to a customer

## 🚀 Setup & Run

### Prerequisites

- [Node.js v22.11.0+](https://nodejs.org/)
- [MySQL Workbench 8.0 CE](https://www.mysql.com/products/workbench/)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Configure environment variables**

   Open `BackEnd/.env` and set your MySQL password:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=project360
   DB_PORT=3306
   ```

3. **Install dependencies & start**

   ```bash
   cd BackEnd
   npm run dev
   ```

4. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000)

> ⚠️ **Warning:** Do NOT refresh the page after starting — the database re-initializes on every server start and all data will be lost.

## 👤 Test Credentials

### Organizers (pre-seeded)

| Email              | Password       |
| ------------------ | -------------- |
| csd5088@csd.uoc.gr | AKava          |
| csd5059@csd.uoc.gr | Ilovelol12@    |
| csd4567@csd.uoc.gr | TsigaraForEver |

> Customers can register directly from the homepage.

## 📁 Project Structure

```
project360/
├── BackEnd/
│   ├── db.js          # Database connection & schema initialization
│   ├── node.js        # Express server & all API routes
│   ├── .env           # Environment variables (DB credentials)
│   └── package.json
└── FrontEnd/
    ├── index.html     # Landing / login page
    └── ...            # Other pages (customer dashboard, organizer dashboard, etc.)
```

## 👥 Team

- CSD5059 — Emiraldo Lamkja
- CSD4567 - Georgia Chrysou
- CSD5088 - Antonis Kavalieros

## 📚 Course

**HY-360 — Database Systems**  
Department of Computer Science, University of Crete — 2024
