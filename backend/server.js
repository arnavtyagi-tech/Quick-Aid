import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./db.js";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import shelterRoutes from "./routes/shelterRoute.js";
import volunteerRoutes from "./routes/volunteerRoute.js";
import planRoutes from "./routes/planRoute.js";
import incidentRoutes from "./routes/incidentRoute.js";
import alertRoutes from "./routes/alertRoute.js";
import postRoutes from "./routes/postRoute.js";
import stripeRoutes from "./routes/stripeRoute.js";
import supplyRoutes from "./routes/donationRoute.js";
import hospitalRoutes from "./routes/hospitalRoute.js";
import responerRoutes from "./routes/responderRoute.js";
import moneyDonationRoutes from "./routes/moneyDonationRoute.js";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import razorpayRoutes from "./routes/razorpayRoute.js"; // New route file for Razorpay key

dotenvConfig();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // The frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials (cookies)
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Configure CORS properly for frontend with credentials
app.use(
  cors({
    origin: "http://localhost:5173", // The frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type, Authorization", // You can include other headers as necessary
    credentials: true, // This allows cookies to be sent with the request
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

connectDB();

// ✅ Register All Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shelter", shelterRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/incident", incidentRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/threads", postRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/donations", supplyRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/responder", responerRoutes);
app.use("/api/money-donations", moneyDonationRoutes);

// New route to send Razorpay key to frontend
app.use("/api/razorpay", razorpayRoutes); // Add this line

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
