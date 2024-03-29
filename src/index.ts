import 'module-alias/register';

import * as dotenv from 'dotenv';
dotenv.config();

import express, {Express} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '@src/routes/authRoutes';
import cloudinaryRoutes from '@src/routes/cloudinaryRoutes';
import errorMiddleware from '@src/middlewares/error-middleware';
import bodyParser from 'body-parser';
import newsRoutes from '@src/routes/newsRoutes';
import commentsRoutes from '@src/routes/commentsRoutes';

const app: Express = express();

const mongoString: string = process.env.DB_URL as string;

mongoose.connect(mongoString)
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

const PORT: string | 3000 = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
