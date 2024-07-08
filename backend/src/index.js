const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3001;
app.use(cors());

let requestCounts = {};
const TIME_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

const rateLimiter = (req, res, next) => {
  const userIP = req.ip;

  if (!requestCounts[userIP]) {
    requestCounts[userIP] = { count: 1, startTime: Date.now() };
  } else {
    const currentTime = Date.now();
    const elapsedTime = currentTime - requestCounts[userIP].startTime;

    if (elapsedTime < TIME_WINDOW) {
      requestCounts[userIP].count++;
    } else {
      requestCounts[userIP] = { count: 1, startTime: currentTime };
    }
  }

  if (requestCounts[userIP].count > MAX_REQUESTS) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  next();
};

app.use(rateLimiter);

app.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get("https://api.example.com/data");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
