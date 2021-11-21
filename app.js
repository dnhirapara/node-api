require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'))

const UserModel = require('./app/models/UserModel');

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === 'OPTIONS') {
//       res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//       return res.status(200).json({});
//   }
//   next();
// });

const dbConfig = require("./config/db.config.js");
const mongoose = require("mongoose");

const connectWithDB = async () => {
  await mongoose
    .connect(dbConfig.url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((connection) => {
      console.log(`Connected with Database: ${connection.connection.name}`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(0);
    });
};
connectWithDB();

app.get("/", async (req, res) => {
  var user = new UserModel({
    email: "18ceuos102@gmail.com",
  });
  await user.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
