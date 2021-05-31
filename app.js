require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send(process.env.DB_URL);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
