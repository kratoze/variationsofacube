// Install express server
const express = require("express");
const path = require("path");

// Initialise express app
const app = express();
const router = express.Router();

// Serve static pages
app.use(express.static("./"));

// Specify public page entry point
app.get("/", function(req, res) {
  res.sendFile(path.join("/index.html"));
});

// Specify port
const port = process.env.PORT || 5000;

// Start the app
app.listen(port, () => {
  console.log("App has started on port: " + port);
});
