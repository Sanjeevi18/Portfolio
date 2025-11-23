const express = require("express");
const path = require("path");
const compression = require("compression");
const cors = require("cors");

// Load environment variables for local development (optional)
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Compress all routes
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Serve static files from the parent directory (portfolio folder)
app.use(
  express.static(path.join(__dirname, ".."), {
    maxAge: "1d", // Cache static files for 1 day
    etag: true,
  })
);

// Specific route for assets
app.use(
  "/assets",
  express.static(path.join(__dirname, "..", "assets"), {
    maxAge: "7d", // Cache assets for 7 days
  })
);

// Main route - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Handle SPA routing - serve index.html for any route that doesn't exist
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Portfolio is live at: http://localhost:${PORT}`);
});

module.exports = app;
