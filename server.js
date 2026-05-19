/**
 * server.js is the entry point for the Weather Dashboard backend
 * It sets up the Express server, middleware, and routes
 */
const express = require("express");
const cors = require("cors");

// Load environment variables from .env file
require("dotenv").config();

// Imports routes
const weatherRoutes = require("./routes/weather");
const app = express();
app.use(cors());

// Parses JSON request bodies
app.use(express.json());

// Serves static files from the "public" directory
app.use(express.static("public"));

// Uses the weather routes
app.use("/api/weather", weatherRoutes);
const PORT = 3000;

// Starts the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});