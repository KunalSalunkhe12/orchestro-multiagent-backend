import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CHAT_BASE_URL = "https://orchestrochatapi.onrender.com";
const JSONIFY_BASE_URL = "https://jsonifyagentapi.onrender.com";
const ORCHESTRA_BASE_URL = "https://orchestraai.onrender.com";

app.get("/", (req, res) => {
  res.send("HEALTH CHECK: OK");
});

app.post("/chat", async (req, res) => {
  try {
    const { user_message, conversation_history } = req.body;

    if (!user_message) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    console.log(conversation_history);

    const response = await axios.post(`${CHAT_BASE_URL}/chat/`, {
      user_message,
      conversation_history,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error processing request:", error);
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while processing your request" });
    }
  }
});

app.post("/generate-json", async (req, res) => {
  try {
    const { conversation_history } = req.body;

    if (!conversation_history) {
      return res
        .status(400)
        .json({ error: "Invalid or missing conversation history" });
    }

    // Convert conversation_history array into a concatenated string
    const history = conversation_history.join(" ");

    const response = await axios.post(`${JSONIFY_BASE_URL}/jsonify-agent/`, {
      history, // Send concatenated chat history as 'history'
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error generating JSON structure:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the JSON structure" });
  }
});

// New route to handle shipping requirements
app.post("/process-shipping", async (req, res) => {
  try {
    const {
      coverage_area,
      carrier_attributes,
      weight_range_in_lbs,
      return_needed,
    } = req.body;

    if (
      !coverage_area ||
      !carrier_attributes ||
      !weight_range_in_lbs ||
      !return_needed
    ) {
      return res
        .status(400)
        .json({ error: "Missing required shipping parameters" });
    }

    const response = await axios.post(
      `${ORCHESTRA_BASE_URL}/process-shipping/`,
      {
        coverage_area,
        carrier_attributes,
        weight_range_in_lbs,
        return_needed,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error processing shipping request:", error);
    res.status(500).json({
      error: "An error occurred while processing the shipping request",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
