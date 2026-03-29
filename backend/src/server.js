import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/database.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const defaultFrontendOrigin = "http://127.0.0.1:5173";
const configuredOrigins = (
  process.env.FRONTEND_BASE_URL ||
  process.env.BASE_URL ||
  defaultFrontendOrigin
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Allow both 127.0.0.1 and localhost variants during development
const allowedOrigins = [
  ...new Set([
    ...configuredOrigins,
    ...configuredOrigins.map((o) => o.replace("127.0.0.1", "localhost")),
    ...configuredOrigins.map((o) => o.replace("localhost", "127.0.0.1")),
  ]),
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
};

const app = express();
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());




connectDB();



app.use("/api/v1", routes);
app.use(errorHandler);









app.get("/", (req, res) => {
  res.send("Spotify API Server Running ");
});

const port = Number(process.env.PORT || 3000);
const publicUrl = process.env.BACKEND_PUBLIC_URL?.trim() || `http://127.0.0.1:${port}`;

app.listen(port, () => {
  console.log(`Server running on ${publicUrl}`);
});
