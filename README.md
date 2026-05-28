# Event Ticketing Platform

A full-stack event management and ticketing web application built for the HY-360 Databases course at the University of Crete (2024).

## Overview

This platform connects Organizers who create and manage events with Customers who browse, book, and pay for tickets. It features real-time seat availability, payment simulation via virtual cards, reservation management, and revenue analytics for organizers.

## Core Features

- **Event Management** — Organizers create events with VIP and Normal ticket tiers and capacity limits
- **Ticket Booking** — Customers book Normal or VIP seats and pay via virtual card
- **Reservation System** — View, filter by date, and cancel reservations with automatic refund
- **Revenue Analytics** — Organizers see total earnings broken down by seat type per event
- **Most Popular Event** — Real-time ranking of events by number of bookings
- **Secure Access** — Separate login flows for Customers and Organizers

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL (3rd Normal Form)
- **Runtime:** Node.js v22.11.0+

## Setup Instructions

### Prerequisites
- Node.js v22.11.0+
- MySQL Workbench 8.0 CE

### 1. Clone the repository

```bash
git clone https://github.com/emiraldol/event-ticketing-platform.git
cd event-ticketing-platform
```

### 2. Configure environment variables

Open `BackEnd/.env` and set your MySQL password:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=project360
DB_PORT=3306
```

### 3. Install dependencies and run

```bash
cd BackEnd
npm run dev
```

### 4. Open the application

Visit http://localhost:3000

> Warning: Do not refresh the page after starting — the database re-initializes on every server start and all data will be lost.

## Database Design

The relational schema follows 3rd Normal Form (3NF) with 6 entities: Customer, Organizer, Event, Ticket, Reservation, and Card.

## Project Structure

```
event-ticketing-platform/
├── BackEnd/
│   ├── node.js        # Express server and all API routes (30+ endpoints)
│   ├── db.js          # Database connection and schema initialization
│   ├── .env           # Environment variables (not committed)
│   └── package.json
└── FrontEnd/
    ├── index.html     # Landing and login page
    └── ...            # Customer and Organizer dashboards
```

## Test Credentials

**Organizers**

| Email | Password |
|-------|----------|
| csd5088@csd.uoc.gr | AKava |
| csd5059@csd.uoc.gr | Ilovelol12@ |
| csd4567@csd.uoc.gr | TsigaraForEver |

Customers can register directly from the homepage.

## Team

- Emiraldo Lamkja (CSD5059)
- Antonis Kavalieros (CSD5088)
- Georgia Chrysou (CSD4567)

## Course

HY-360 — Database Systems  
Department of Computer Science, University of Crete — 2024
