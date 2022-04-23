const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// register middleware for CORS and JSON
app.use(cors());
app.use(express.json());

// initialize Firebase Admin
require("./firebase");

const messagesRoute = require("./routes/messages");

app.use("/messages", messagesRoute);

app.use((req, res) => {
  res.status(404).json({
    message: "No such endpoint",
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});
