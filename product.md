# DEALMIND Game – Product Specification Document

## 1. Product Overview

The AI Negotiation Game is a gamified, multi-round negotiation platform where users interact with an intelligent AI seller to purchase a fixed product at the lowest possible price. The AI operates with hidden constraints such as minimum acceptable price, target profit margin, negotiation personality, and behavioral strategies.

The objective of the user is to strategically negotiate through reasoning, timing, and psychological tactics to secure the lowest possible deal. The final negotiated price determines the user’s ranking on a global leaderboard.

This product combines elements of game design, artificial intelligence, and behavioral simulation to create an engaging and competitive experience.

---

## 2. Objectives

The primary objectives of the product are:

* To simulate realistic negotiation scenarios using AI
* To gamify decision-making and strategic thinking
* To provide a competitive leaderboard-driven experience
* To demonstrate applied AI and full-stack engineering capabilities
* To deliver a visually engaging and modern UI inspired by minimal, isometric design systems

---

## 3. Target Audience

* Students and developers interested in AI-based applications
* Users interested in strategy-based games
* Recruiters evaluating full-stack and AI integration skills
* Tech enthusiasts exploring human-AI interaction

---

## 4. Core Features

### 4.1 User Authentication

* User registration with email and password
* Secure login system using JWT authentication
* Password hashing using bcrypt
* Protected routes for authenticated users
* Optional future support for OAuth (Google, GitHub)

---

### 4.2 Negotiation Gameplay

Each game session consists of a multi-round negotiation between the user and the AI seller.

#### Game Mechanics:

* The AI starts with an initial asking price
* The user submits offers and messages
* The AI responds based on internal logic and constraints
* The negotiation continues until:

  * A deal is reached
  * The seller rejects the deal
  * The maximum number of rounds is reached

---

### 4.3 AI Seller System

Each AI seller is defined by the following parameters:

* Minimum Price (hidden from user)
* Target Price
* Asking Price
* Personality Type
* Trust Level
* Patience Level
* Mood State

#### Personality Types:

* Greedy: resistant to low offers, prefers profit
* Emotional: influenced by tone and politeness
* Logical: responds to reasoning and data
* Impatient: reacts quickly, limited tolerance

---

### 4.4 Game State System

The system maintains a dynamic state throughout the negotiation:

* Current price
* Trust score
* Seller mood
* Remaining patience
* Round count

Each user action affects the state, which in turn influences the AI’s response.

---

### 4.5 Player Actions

Users can interact using structured actions:

* Make Offer
* Justify Offer
* Build Rapport
* Delay Response
* Bluff
* Exit Negotiation

Each action modifies internal variables such as trust, mood, and price flexibility.

---

### 4.6 Leaderboard System

The leaderboard ranks users based on their negotiation performance.

#### Scoring Criteria:

* Final negotiated price
* Minimum possible price
* Number of rounds taken
* Efficiency of negotiation

Example formula:
Score = (Minimum Price / Final Price) * 100

---

### 4.7 UI/UX Design

The interface follows a modern, minimal, and visually rich design inspired by isometric and pastel-based layouts.

#### Key Elements:

* Section-based landing page
* Smooth transitions and animations
* Game dashboard layout
* Seller avatar with mood indication
* Real-time trust and patience indicators
* Clean typography and spacing

---

## 5. Technical Architecture

### 5.1 Tech Stack

Frontend:

* React.js
* Tailwind CSS
* State management using Zustand or Redux
* Framer Motion for animations

Backend:

* Node.js
* Express.js

Database:

* MongoDB

AI Integration:

* Gemini API
* LangChain for prompt orchestration and chaining

---

### 5.2 Project Structure

Root Directory:

* client (frontend application)
* server (backend application)
* shared (optional shared constants/types)
* docs (documentation)

Frontend Structure:

* app (routing and providers)
* features (auth, game, leaderboard)
* components (reusable UI elements)
* pages (route-level components)
* services (API calls)
* store (state management)

Backend Structure:

* controllers (request handlers)
* routes (API endpoints)
* models (database schemas)
* services (business logic)
* middlewares (auth, validation)
* config (environment setup)
* lib (LangChain and Gemini setup)

---

### 5.3 API Design

Auth Routes:

* POST /api/auth/register
* POST /api/auth/login

Game Routes:

* POST /api/game/start
* POST /api/game/move
* GET /api/game/history

Leaderboard Routes:

* GET /api/leaderboard

---

## 6. AI System Design

The AI operates using structured prompts generated via LangChain.

Each request to the AI includes:

* Seller constraints
* Current game state
* User input

The AI response is then processed and combined with backend logic to update the game state.

---

## 7. Database Schema

### User Collection:

* name
* email
* password
* score
* gamesPlayed
* createdAt

### Game Collection:

* userId
* finalPrice
* minimumPrice
* rounds
* success (boolean)
* createdAt

---

## 8. Game Engine Logic

The negotiation engine is responsible for:

* Updating trust levels based on user actions
* Adjusting mood dynamically
* Modifying price based on constraints
* Determining when the game ends

This logic is implemented as a backend service to ensure consistency and security.

---

## 9. Development Roadmap

### Phase 1:

* User authentication
* Basic negotiation flow
* Minimal UI

### Phase 2:

* AI personality system
* Trust and mood engine
* Improved UI design

### Phase 3:

* Leaderboard implementation
* Animations and polish
* Advanced game mechanics

---

## 10. Future Enhancements

* Multiplayer negotiation mode
* Daily challenges and rewards
* Different product categories
* AI difficulty levels
* Analytics dashboard
* Voice-based negotiation

---

## 11. Key Differentiators

* Combines AI with game mechanics rather than simple chat interaction
* Dynamic behavioral modeling of AI agents
* Competitive leaderboard system
* High-quality UI inspired by modern game design
* Real-world application of negotiation psychology

---

## 12. Conclusion

The AI Negotiation Game is a full-stack application that integrates artificial intelligence, game theory, and modern UI design into a single platform. It serves both as an engaging user product and a strong demonstration of advanced development capabilities, including AI integration, state management, and scalable architecture.

This project is designed to be both technically impressive and practically valuable, making it suitable for portfolio presentation and real-world deployment.
