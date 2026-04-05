import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {

  const userMsg = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "user", content: userMsg }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.json({ reply: "Error: " + JSON.stringify(data) });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.json({
      reply: "Server Error 😢"
    });
  }

});

app.listen(10000, () => console.log("Server running"));
