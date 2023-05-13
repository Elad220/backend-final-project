const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./utils/connectDb");
const createUser = require("./utils/createUser");

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

connectDb();
createUser();

app.use("/", require("./routes/index"));

// start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
