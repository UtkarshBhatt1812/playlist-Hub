import express from "express";
import axios from "axios";
import cors from "cors";
import routes from "./routes/routes.js";
import { connectDB } from "./db/database.js";



const app = express();
app.use(cors());
app.use(express.json());




connectDB();



app.use("/api/v1", routes);









app.get("/", (req, res) => {
  res.send("Spotify API Server Running ");
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
