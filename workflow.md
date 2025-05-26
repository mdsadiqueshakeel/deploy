Affiliate MLM System Architecture
May 18, 2025
1 Overview
This document outlines the architecture of an Affiliate Multi-Level Marketing (MLM) system, detailing the frontend and backend components, their interactions, and a phased development plan to ensure seamless synchronization between frontend and backend development teams. The system is designed to support user management, binary treebased referrals, business volume tracking, income calculations, and administrative controls.
2 System Architecture
2.1 Frontend (Client-Side)
The frontend is built using Next.js for server-side rendering and static site generation, paired with Tailwind CSS for responsive and modular styling. The frontend serves both user and admin interfaces, communicating with the backend via an API layer.

Components:
User Dashboard: Displays referral links, binary tree visualization, business volume, matching income, level income, and account details.
Admin Panel: Provides tools for managing users, updating business volumes, triggering income calculations, viewing reports, updating ranks, and a comprehensive dashboard to review all users' details (profile, referral codes, binary tree position, business volumes, matching income, level income) with filtering and sorting capabilities. Only one admin, registered in the database with isAdmin: true, has access to this panel.
API Layer: Uses tried to interact with the backend API gateway, handling authentication and data retrieval.


Features:
Responsive design for mobile and desktop.
Real-time updates for income and volume stats.
Secure JWT-based authentication for user sessions.



2.2 Backend API Gateway
The API gateway is built with Express.js, serving as the entry point for frontend requests. It handles authentication, routing, and cross-origin resource sharing (CORS) for microservices.

Features:
JWT Authentication: Secures endpoints using JSON Web Tokens.
CORS: Enables communication with microservices.
Routing: Directs requests to appropriate microservices (User, Business Volume, etc.).


Endpoints:
POST /auth/login: Authenticates users.
GET /user/profile: Retrieves user data.
POST /business/add: Adds business volume.
GET /admin/reports: Fetches admin reports.
GET /admin/users: Retrieves all users' details (profile, referral codes, binary tree position, business volumes, matching income, level income) for the admin dashboard, accessible only to the single admin with isAdmin: true.



2.3 Backend Microservices
The backend is composed of five microservices, each responsible for a specific domain of the MLM system. All services interact with a shared MongoDB database using Mongoose models.
2.3.1 User Service
Handles user-related operations and binary tree management.

Features:
User creation and authentication (login/signup). Only one user with isAdmin: true exists in the database, designated as the system admin.
Referral code generation and validation.
Binary tree node assignment (left/right child based on referral link).


Data Models:
User: Stores user details, referral code, binary tree position, and isAdmin flag to identify the single admin.



2.3.2 Business Volume Service
Tracks and propagates business volume within the binary tree.

Features:
Records personal business volume for users.
Propagates volume upward through the binary tree to ancestors.
Maintains subtree volume (left and right) for each user.


Data Models:
BusinessVolume: Stores volume per user and subtree aggregates.



2.3.3 Matching Income Service
Calculates matching income based on binary tree subtrees.

Features:
Computes income as min(left_subtree_volume, right_subtree_volume) * 0.05.
Handles carry-forward logic for unpaired volume.
Adds calculated income to user accounts.


Data Models:
Matching Income: Tracks income and carry-forward volume.



2.3.4 Level Income Service
Distributes bonuses across referral levels.

Features:
Distributes percentage-based bonuses up to 30 levels in the referral chain.
Tracks level income per user.


Data Models:
Level Income: Records income per level for each user.



2.3.5 Admin Service
Provides administrative controls and reporting, accessible only to the single admin with isAdmin: true.

Features:
Manually updates business volumes.
Triggers matching and level income calculations.
Generates reports on payouts and user activity.
Updates user ranks based on performance.
Allows the admin to review all users' details, including profile, referral codes, binary tree position, business volumes, matching income, and level income, with filtering and sorting capabilities.


Data Models:
AdminLog: Tracks admin actions for auditing.



2.4 Shared Database
The system uses MongoDB as the primary database, with Mongoose for schema definition and data access. Each microservice interacts with the database independently, ensuring loose coupling.

Schemas:
User: {id, email, password, referralCode, leftChild, rightChild, parent, isAdmin}
BusinessVolume: {userId, personalVolume, leftSubtreeVolume, rightSubtreeV}
MatchingIncome: {userId, income, leftCarryForward, rightCarryForward}
LevelIncome: {userId, level, income}
AdminLog: {adminId, action, timestamp}


Features:
Indexes on userid and referralCode for fast lookups.
Transactions for atomic updates (e.g., income calculations).



3 Data Flow
The system operates as follows:

A user joins via a left or right referral link, triggering the User Service to place them in the binary tree.
The user purchases or adds business volume, recorded by the Business Volume Service and propagated upward.
The Matching Income Service calculates income based on the minimum of left and right subtree volumes, applying carry-forward logic.
The Level Income Service distributes bonuses across up to 30 levels of the referral chain.
The single admin (with isAdmin: true) uses the Admin Service to override volumes, trigger calculations, view reports, update ranks, and review all users' details (profile, referral codes, binary tree position, business volumes, matching income, level income) through a dedicated dashboard.
Users and the admin view data (income, stats, tree) via the frontend dashboard, which queries the API gateway.

Figure 1: System Architecture Diagram
4 Phased Development Plan
To ensure synchronization between frontend and backend development, the project is divided into phases, with clear deliverables for each.
4.1 Phase 1: Foundation (Weeks 1-4)

Backend:
Set up MongoDB and define Mongoose schemas for User, BusinessVolume, and AdminLog.
Implement User Service: User creation, authentication, and referral code logic. Ensure one user is registered with isAdmin: true as the system admin.
Set up API Gateway with JWT authentication and basic routing.


Frontend:
Initialize Next.js project with Tailwind CSS.
Create user authentication pages (login/signup).
Build basic user dashboard layout (placeholder for stats).


Sync Point: Frontend authenticates users via API gateway, displaying user profile data.

4.2 Phase 2: Binary Tree and Business Volume (Weeks 5-8)

Backend:
Enhance User Service with binary tree node assignment.
Implement Business Volume Service for tracking personal and subtree volumes.


Frontend:
Add referral link generation and binary tree visualization to user dashboard.
Create forms for adding business volume.


Sync Point: Users can join via referral links, view their position in the binary tree, and add business volume, with data reflected in the dashboard.

4.3 Phase 3: Income Calculations (Weeks 9-12)

Backend:
Implement Matching Income Service for calculating income and carry-forward logic.
Implement Level Income Service for distributing bonuses across 30 levels.


Frontend:
Display matching and level income in user dashboard.
Add income history and summary widgets.


Sync Point: Users see real-time income calculations and history in their dashboard.

4.4 Phase 4: Admin Features and Polish (Weeks 13-16)

Backend:
Implement Admin Service for manual updates, calculation triggers, reports, rank updates, and a feature to fetch all users' details (profile, referral codes, binary tree position, business volumes, matching income, level income) for the single admin with isAdmin: true.


Frontend:
Build admin panel with tools for managing users, volumes, reports, and a comprehensive dashboard to review all users' details with filtering and sorting capabilities, accessible only to the single admin.
Add responsive design tweaks and performance optimizations.


Sync Point: The single admin can manage the system, review all users' details, and users experience a polished, responsive interface.

4.5 Phase 5: Testing and Deployment (Weeks 17-20)

Backend:
Conduct unit and integration tests for all microservices.
Optimize database queries and add indexes.


Frontend:
Perform end-to-end testing for user and admin flows, including the admin dashboard for reviewing all users.
Optimize Next.js for SEO and performance.


Sync Point: System is fully tested, deployed, and ready for production use.

5 Conclusion
This architecture provides a scalable and modular foundation for the Affiliate MLM system. The phased development plan ensures that frontend and backend teams work in parallel, with regular sync points to validate functionality. By leveraging Next.js, Express.js, and MongoDB, the system supports robust user management, income calculations, and administrative controls, including a comprehensive admin dashboard for the single admin to review all users' details, meeting the needs of both users and the admin.
