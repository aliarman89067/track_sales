// LIBRARY IMPORTS
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotEnv from "dotenv";
// ROUTES IMPORT
import adminRoutes from "./routes/adminRoutes";
import agentRoutes from "./routes/agentRoutes";
import organizationRoutes from "./routes/organizationRoutes";
import memberRoutes from "./routes/memberRoutes";
import saleRoutes from "./routes/saleRoutes";
// MIDDLEWARE IMPORTS
import { authMiddleware } from "./middleware.ts/authMiddleware";

dotEnv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/admin", authMiddleware(["admin"]), adminRoutes);
app.use("/agent", authMiddleware(["agent"]), agentRoutes);
app.use(
  "/organizations",
  authMiddleware(["admin", "agent"]),
  organizationRoutes
);
app.use("/members", authMiddleware(["admin"]), memberRoutes);
app.use("/sale", authMiddleware(["admin", "agent"]), saleRoutes);

// TESTING ROUTE
app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
