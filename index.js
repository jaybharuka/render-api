// index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyAuS_fGrFxv7SBwECfFkKbTseQIT-i5YTA"; // Replace with your Gemini API key

// === Route: Get Disease Details ===
app.post("/getDiseaseDetails", async (req, res) => {
  const { disease } = req.body;

  if (!disease) {
    return res.status(400).json({ error: "Disease name is required." });
  }

  try {
    const prompt = `Suggest common medicines and related symptoms for the disease: ${disease}. 
The response should be in clear JSON format with "symptoms" and "medicines" arrays.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const textResponse = response.data.candidates[0].content.parts[0].text;

    const match = textResponse.match(/\{[\s\S]*\}/);
    const jsonData = match ? JSON.parse(match[0]) : { message: textResponse };

    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch data from Gemini API" });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
