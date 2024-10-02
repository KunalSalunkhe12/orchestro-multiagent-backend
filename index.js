import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CHAT_BASE_URL = "https://orchestrochatapi.onrender.com";
const JSONIFY_BASE_URL = "https://jsonifyagentapi.onrender.com";
const ORCHESTRA_BASE_URL = "https://orchestraai.onrender.com";
const STATE_COVERAGE_BASE_URL = "https://usstatecoverageapi.onrender.com";
const CUSTOMER_SENTIMENT_BASE_URL = "https://sentimentapi-vq9g.onrender.com";
const CARRIER_INTERACTIVE_BASE_URL =
  "https://nteractivecarriercomparisonapi.onrender.com";
const SHIPPING_COST_BASE_URL = "https://shippingcostapi.onrender.com";
const CARRIER_RATE_BASE_URL = "https://carrierratecomparisonapi.onrender.com";

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

    const history = conversation_history.join(" ");

    const response = await axios.post(`${JSONIFY_BASE_URL}/jsonify-agent/`, {
      history,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error generating JSON structure:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the JSON structure" });
  }
});

app.post("/process-shipping", async (req, res) => {
  try {
    const {
      coverage_area,
      carrier_attributes,
      weight_range_in_lbs,
      return_needed,
    } = req.body;

    console.log({
      coverage_area,
      carrier_attributes,
      weight_range_in_lbs,
      return_needed,
    });

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

function extractCarriers(data) {
  return data.map((item) => {
    const key = Object.keys(item).find((k) => k.endsWith("_ranked_carrier"));
    return item[key];
  });
}

// New route for State Coverage Comparison API
app.post("/state-coverage-comparison", async (req, res) => {
  try {
    const { carriers } = req.body;

    const carrierData = extractCarriers(carriers);

    if (!carriers || !Array.isArray(carriers)) {
      return res.status(400).json({ error: "Invalid or missing carriers" });
    }

    const response = await axios.post(
      `${STATE_COVERAGE_BASE_URL}/state-coverage-comparison/`,
      {
        carriers: carrierData,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error processing state coverage comparison request:", error);
    res.status(500).json({
      error:
        "An error occurred while processing the state coverage comparison request",
    });
  }
});

// New route for Customer Sentiment Comparison API
app.post("/customer-sentiment-comparison", async (req, res) => {
  try {
    const { carriers } = req.body;
    const carrierData = extractCarriers(carriers);

    if (!carriers || !Array.isArray(carriers)) {
      return res.status(400).json({ error: "Invalid or missing carriers" });
    }

    const response = await axios.post(
      `${CUSTOMER_SENTIMENT_BASE_URL}/customer-sentiment-comparison/`,
      {
        carriers: carrierData,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error processing customer sentiment comparison request:",
      error
    );
    res.status(500).json({
      error:
        "An error occurred while processing the customer sentiment comparison request",
    });
  }
});

// New route for Carrier Interactive Comparison API
app.post("/carrier-interactive-comparison", async (req, res) => {
  try {
    const { carriers } = req.body;
    const carrierData = extractCarriers(carriers);

    if (!carriers || !Array.isArray(carriers)) {
      return res.status(400).json({ error: "Invalid or missing carriers" });
    }

    const response = await axios.post(
      `${CARRIER_INTERACTIVE_BASE_URL}/carrier-interactive-comparison/`,
      {
        carriers: carrierData,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error processing carrier interactive comparison request:",
      error
    );
    res.status(500).json({
      error:
        "An error occurred while processing the carrier interactive comparison request",
    });
  }
});

// New route for Shipping Cost Comparison API
app.post("/shipping-cost-comparison", async (req, res) => {
  try {
    const { carriers } = req.body;
    const carrierData = extractCarriers(carriers);

    if (!carriers || !Array.isArray(carriers)) {
      return res.status(400).json({ error: "Invalid or missing parameters" });
    }

    const response = await axios.post(
      `${SHIPPING_COST_BASE_URL}/shipping-cost-comparison/`,
      {
        carriers: carrierData,
        num_examples: 5,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error processing shipping cost comparison request:", error);
    res.status(500).json({
      error:
        "An error occurred while processing the shipping cost comparison request",
    });
  }
});

// New route for Carrier Rate Comparison API
app.post("/carrier-rate-comparison", async (req, res) => {
  try {
    const { carriers, years } = req.body;
    const carrierData = extractCarriers(carriers);

    if (!carriers || !Array.isArray(carriers)) {
      return res.status(400).json({ error: "Invalid or missing parameters" });
    }

    const response = await axios.post(
      `${CARRIER_RATE_BASE_URL}/carrier-rate-comparison/`,
      {
        carriers: carrierData,
        years: 4,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error processing carrier rate comparison request:", error);
    res.status(500).json({
      error:
        "An error occurred while processing the carrier rate comparison request",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
