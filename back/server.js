const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");
const { connectToDB } = require("./models");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { private } = require("./middleware/auth");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const port = process.env.DB_API_PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const ssl = process.env.DB_HOST ? true : false;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "1a2b3c",
  port: process.env.DB_PORT || 5432,
  ssl: ssl,
});

connectToDB(pool);

app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

app.use(cookieParser());
app.use("/api/auth", require("./auth/route"));
app.use("/api", require("./routes/routes"));

app.get("/api/private", private, (req, res) =>
  res.json({
    user: req.user,
  })
);

app.get("/", (req, res) => res.send("Successfull conected to api"));

app.listen(port, () => {
  console.log("Server OK on port: ", port);
});

module.exports = pool;
