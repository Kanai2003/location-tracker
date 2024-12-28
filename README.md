# Real-Time GPS Location Tracking System

This project is a **Real-Time GPS Location Tracking System** backend, built to handle live GPS location pings and manage user registration, login, and role-based data access. The system uses a combination of SQL (PostgreSQL) and NoSQL (MongoDB) databases and includes Redis for caching.

## Features

- **User Authentication:** Secure user registration and login functionality with JWT.
- **Real-Time Location Tracking:** Handles live GPS location pings sent every 4 seconds.
- **Admin Panel (API-based):** Admins can monitor all users' location logs and manage user accounts.
- **Scalability:** Built with Redis caching and Docker for scalable deployment.
- **Database Management:**
  - **PostgreSQL:** For structured data like user profiles.
  - **MongoDB:** For flexible storage of location data.
- **Optimized Architecture:** Uses Redis for caching and performance improvements.


## Prerequisites
Ensure you have the following installed on your system:
- Docker
- Docker Compose

## Installation and Setup Instructions
**Step 1: Clone Repository**
```bash
git clone https://github.com/Kanai2003/location-tracker
cd location-tracker/server
```
**Step 2: Install Docker in your local machine**

**Step 3: Start the Backend with Docker(If you don't have docker installed)**


Run the following command to start all services (Redis, PostgreSQL, MongoDB, and the Node.js backend):
```bash
docker-compose up --build
```
This will:
1. Spin up a PostgreSQL database for structured data.
2. Launch a MongoDB database for location data.
3. Set up Redis for caching.
4. Start the Node.js backend.

Once all services are running, the backend will be accessible at:
`http://localhost:8000`

## Stopping the services
To stop all running services, use:
```bash
docker-compose down
```

## Postman Docs
Use postman API Docs [here](https://documenter.getpostman.com/view/27116622/2sAYJ6CLCa)
or you can use the exported json file in the root directory [exported-postnam_collection.json](./Location_tracker.postman_collection.json).


## Additional Notes
- No frontend UI is built; use Postman or similar tools for testing the backend.
- Ensure Docker is properly configured to allocate sufficient memory and resources for the containers.

## License
This project is licensed under the MIT License.