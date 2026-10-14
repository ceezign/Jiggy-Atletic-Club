import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";

import authRoutes from "./routes/authRoutes";
import activityRoutes from "./routes/activityRoutes";
import coachRoutes from "./routes/coachRoutes";
import classRoutes from "./routes/classRoutes";
import membershipRoutes from "./routes/membershipRoutes";
import freeTrialRoutes from "./routes/freeTrialRoutes";
import memberRoutes from "./routes/memberRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import contactRoutes from "./routes/contactRoutes";
import contentRoutes from "./routes/contentRoutes";
import adminRoutes from "./routes/adminRoutes";
import { cacheFor } from "./middleware/cache";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

// Trust the first proxy hop (Vercel/Render/behind a load balancer) so secure
// cookies and rate limiting see the real client IP/protocol.
app.set("trust proxy", 1);

app.use(compression());
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Global rate limit as a baseline safety net; auth routes apply a stricter one.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));

app.use("/api/auth", authRoutes);
app.use("/api/activities", cacheFor(60), activityRoutes);
app.use("/api/coaches", cacheFor(60), coachRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/memberships/plans", cacheFor(60));
app.use("/api/memberships", membershipRoutes);
app.use("/api/free-trial", freeTrialRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", cacheFor(60), contentRoutes); // /api/blog, /api/testimonials, /api/gallery

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
