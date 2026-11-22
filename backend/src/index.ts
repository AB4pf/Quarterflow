import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import termRoutes from "./routes/terms.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(cors({ origin: true, allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/terms", termRoutes);

// Future route groups go here, e.g.:
// app.use("/api/terms", termRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/assignments", assignmentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`QuarterFlow backend listening on port ${PORT}`);
});
