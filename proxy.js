import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// <<< WSTAW SWÓJ TOKEN >>>
const API_TOKEN = "gkqWLFRjuPIcxXrMkPxoUDXJqvmJXzaj";
const API_BASE = "https://www.ncei.noaa.gov/cdo-web/api/v2";

app.use(cors()); // pozwala na wywołania z Twojego frontendu

// Funkcja pomocnicza
async function proxyFetch(endpoint, res) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { token: API_TOKEN }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Endpointy proxy
app.get("/stations", (req, res) => proxyFetch("/stations", res));
app.get("/datasets", (req, res) => proxyFetch("/datasets", res));
app.get("/data", (req, res) => {
  const query = req.url.replace("/data", ""); // zachowujemy parametry ?datasetid=...
  proxyFetch(`/data${query}`, res);
});

app.listen(PORT, () => {
  console.log(`Proxy działa na http://localhost:${PORT}`);
});