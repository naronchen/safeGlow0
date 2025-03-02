# Emergency Alert Backend

This backend API is built with Express and SQLite to handle emergency alerts. It receives POST requests, stores alerts in the SQLite database, and provides a GET endpoint to retrieve the alerts.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/)
- SQLite (installed automatically as a dependency via the `sqlite3` package)

## Setup

1. **Clone the repository**  
   If you haven't already, clone the repository and navigate into the project directory:

   ```sh
   git clone <repository-url>
   cd backend
   ```

2. **Create a .env file**
   In the backend folder, create a .env file to set environment variables. For example:

```env
PORT=3000
```

3. **Install dependencies**
   From the backend directory, run:

```
npm install
```

4. **Running the Backend**
   To start the server, run the following command from the project root:

```
npm run backend
```
