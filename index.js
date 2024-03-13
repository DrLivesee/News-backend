require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const newsRoutes = require("./routes/newsRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const authRoutes = require("./routes/authRoutes");

const cloudinaryRoutes = require('./routes/cloudinaryRoutes')

const errorMiddleware = require("./middlewares/error-middleware");
const bodyParser = require("body-parser");

const app = express();

const mongoString = process.env.DB_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.use(express.json());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use("/news", newsRoutes);
app.use("/comments", commentsRoutes);
app.use("/auth", authRoutes);
app.use('/upload-image', cloudinaryRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
