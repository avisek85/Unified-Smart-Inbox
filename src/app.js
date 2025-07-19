/**
 * Main server file
 * - Initializes Express app
 * - Connects to MongoDB
 * - Sets up Socket.io
 * - Loads routes
 */

require("dotenv").config(); // Load env variables from .env
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db"); // Import mongoose connection
const http = require("http");

const webhookRoutes = require("./routes/webhook.routes");
const authRoutes = require("./routes/auth.routes"); // Import auth routes
const channelRoutes = require("./routes/channel.routes"); // Import channel routes
const contactRoutes = require("./routes/contact.route"); // Import contact routes
const { protect } = require("./middlewares/auth.middleware"); // Import auth middleware
const messageRoutes = require("./routes/message.routes"); // Import message routes
const socket = require("./sockets"); // our socket module

const app = express();
const PORT = process.env.PORT || 5000;
// Connect to Database and Start Server
connectDB();

// --- Middlewares ---
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // adjust for production
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // parse JSON payloads


// --- Routes ---
app.use('/api/auth', authRoutes);      
app.use("/api", webhookRoutes);
app.use("/api/channels", channelRoutes); 
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes); // Add message routes



// --- Create HTTP server & attach Socket.io ---
const server = http.createServer(app);
socket.init(server);


// --- Start server ---
server.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
