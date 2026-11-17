import { useEffect, useState } from "react";

const HEALTH_URL = "http://127.0.0.1:8787/api/health";

export const ServerStatus = () => {
  const [status, setStatus] = useState("Checking...");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(HEALTH_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setStatus(typeof data === "string" ? data : JSON.stringify(data));
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setStatus("Unavailable");
        setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1>Server Status</h1>
      <p>{status}</p>
      {error && <p role="alert">{error}</p>}
    </div>
  );
};