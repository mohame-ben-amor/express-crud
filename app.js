const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const connection = require("./database/mysqlDB");

const app = express();

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Referer', 'Accept', 'User-Agent'],
  exposedHeaders: ['Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// database init
function mysqlConnect() {
  global.connection = mysql.createConnection(connection);

  global.connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to db");
      setTimeout(mysqlConnect, 2000);
    }
    console.log("connected to database");
  });
  global.connection.on("error", function (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      mysqlConnect();
    } else {
      throw err;
    }
  });
}

mysqlConnect();

// Routes
const userRoutes = require("./routes/user");

// Middlewares
app.use(bodyParser.json());

// Routes
app.use("/api", userRoutes);

// PORT
const port = process.env.PORT || 3000;

// Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
