import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is live! 🚀");
});

app.post("/generate", async (req, res) => {
  const { prompt, framework } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Describe your component first" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are an expert UI developer.

Generate a modern, animated, fully responsive UI component.

User request: ${prompt}
Framework: ${framework}

Rules:
- Return ONLY code
- Single HTML file
- No explanation
- Inside markdown fenced code block
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: data.error?.message || "Gemini API Error",
      });
    }

    res.status(200).json({
      result: data.candidates?.[0]?.content?.parts?.[0]?.text,
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Something went wrong while generating code" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
