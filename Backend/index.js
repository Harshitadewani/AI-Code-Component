import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🔥 SAME LOGIC AS FRONTEND getResponse()
app.post("/generate", async (req, res) => {
  const { prompt, framework } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Describe your component first" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}
Framework to use: ${framework}

Requirements:
- The code must be clean, well-structured, and easy to understand.
- Optimize for SEO where applicable.
- Focus on creating a modern, animated, and responsive UI design.
- Include high-quality hover effects, shadows, animations, colors, and typography.
- Return ONLY the code, formatted properly in Markdown fenced code blocks.
- Do NOT include explanations, text, comments, or anything else besides the code.
- And give the whole code in a single HTML file.
      `,
    });

    res.status(200).json({
      result: response.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong while generating code" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
