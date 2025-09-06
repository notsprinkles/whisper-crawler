import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");

  const handleScan = async () => {
    if (!url) return;
    try {
      const res = await axios.post("http://localhost:3001/scan", { url });
      console.log(res.data); // for dev
      // TODO: handle result display
    } catch (err) {
      console.error("Scan error", err);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>
          🕵️ Whisper Crawler <span className="sparkle">✨</span>
        </h1>
        <p className="description">
          Scan any site for ARIA traps & accessibility red flags.
        </p>
        <input
          type="text"
          placeholder="Enter a URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleScan}>Scan Website</button>
      </div>
    </div>
  );
}

export default App;
