# Node.js REST API - Expense Tracker  

This is a Node.js REST API project for an expense tracker application. The API allows users to add expenses, retrieve expenses, manage users, and perform other related operations. The project uses the Express.js framework and MongoDB for data storage.

## Prerequisites

Before running the project, ensure that you have the following prerequisites installed:

- Node.js
- MongoDB

## Getting Started

Follow the steps below to get started with the project:

Clone the repository or download the source code.

Install the project dependencies by running the following command in the project directory:

Copy code

npm install

Set up the environment variables

npm start

This will start the server at <http://localhost:3000>.

## API Endpoints

The following API endpoints are available:

- GET /report: Retrieve all expenses for a given user, grouped by category.
- GET /report-id: Retrieve all expenses for a given user, including expense IDs, grouped by category.
- POST /addcost: Add a new expense.
- POST /adduser: Create a new user.
- GET /about: Get information about the developers.
- DELETE /removeuser: Remove a user.
- DELETE /removecost: Remove an expense.
- DELETE /purge-user: Remove all users from the database.
- DELETE /purge-expenses: Remove all expenses from the database.

## Project Structure

The project structure is as follows:

- controllers: Contains the controller functions for handling API requests.
- models: Contains the Mongoose models for defining the database schemas.
- utils: Contains utility functions used in the controllers.
- routes.js: Defines the API routes and their corresponding controller functions.
- index.js: The main entry point of the application.

## Database Schema

The project uses MongoDB for data storage. The database schema includes the following collections:

- users: Stores user information.
- expenses: Stores expense information.

## Error Handling

The API handles various error scenarios and returns appropriate error responses. Possible error cases include missing or invalid parameters, database errors, and resource not found.
