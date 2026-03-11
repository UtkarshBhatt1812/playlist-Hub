import express from "express";
import registerHandler from "../controllers/authControllers/register.controller.js";
import  loginHandler from "../controllers/authControllers/login.controller.js";
import  refreshHandler from "../controllers/authControllers/refresh.controller.js";
import  logoutHandler from "../controllers/authControllers/logout.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/refresh", authMiddleware, refreshHandler);
router.post("/logout",authMiddleware, logoutHandler);

export default router;
