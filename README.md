# 🎮 Games Inventory App

A full-stack CRUD web application built to manage a video game collection, organized by genres and hardware platforms. Developed using Node.js, Express, EJS, and PostgreSQL.

---

## 🚀 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Hosted on Neon.tech)
* **Templating Engine:** EJS (Embedded JavaScript Templates)
* **Database Driver:** `pg` (node-postgres)
* **Environment Management:** `dotenv`

---

## ✨ Features

* **Game List:** View all inventory items in a clean tabular layout with details like release year, rating, genre, and platform.
* **Detail Views:** Click on any game title to view its dedicated detail page.
* **Category Filtering:** Browse games grouped by genre categories.
* **Create & Update:** Add new games via a dynamic form with dropdown selectors, and edit existing records with pre-filled inputs.
* **Relational Database:** Enforces relational integrity using foreign keys, constraints, and cascade options across `games`, `genres`, and `platforms` tables.

---

## ⚙️ Getting Started

Follow these instructions to get a local copy up and running on your machine or in a GitHub Codespace.

### Prerequisites
* Node.js installed on your machine.
* A PostgreSQL database instance (e.g., [Neon.tech](https://neon.tech)).

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/games-inventory.git](https://github.com/YOUR_USERNAME/games-inventory.git)
cd games-inventory

install dependencies:
npm install

configure environment variables:
DATABASE_URL=your_neon_postgresql_connection_string_here
PORT=8080

run the application:
npm run dev

open your browser and nevigate to http://localhost:8080/.

games-inventory/
│
├── src/
│   ├── db/
│   │   └── pool.js       # PostgreSQL connection pool configuration
│   └── index.js          # Express server and application routes
│
├── views/
│   ├── index.ejs         # Homepage game listing template
│   ├── new-game.ejs      # Form to create a new game
│   ├── game-detail.ejs   # Individual game detail view
│   └── edit-game.ejs     # Form to update an existing game
│
├── .env                  # Environment variables (git-ignored)
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation

