import express from "express";
import axios from "axios";
import cors from "cors";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/database.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(cookieParser());
app.use(cors(
  {
    origin: process.env.BASE_URL ,
    credentials: true
  }
));
// adding a comment
app.use(express.json());




connectDB();



app.use("/api/v1", routes);
app.use(errorHandler);









app.get("/", (req, res) => {
  res.send("Spotify API Server Running ");
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
