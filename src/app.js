const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./utils/connect-db");
const createUser = require("./utils/create-user");

// load environment variables
dotenv.config();

// create the express app
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// connect to the database
connectDb();

// create a user if one is not already present
createUser();

// setup the routes for the app
app.use("/", require("./routes/index"));

// start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
