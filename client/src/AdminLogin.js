import React, { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Simple hardcoded login for demo
    if (username === "admin" && password === "ullavar2025") {
      setError("");
      onLogin();
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="admin-login" style={{ maxWidth: 400, margin: "4em auto", padding: "2em", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <h2 style={{ color: "#388e3c", marginBottom: "1.5em" }}>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1em" }}>
          <label>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: "100%", padding: "0.5em" }} />
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: "0.5em" }} />
        </div>
        {error && <div style={{ color: "red", marginBottom: "1em" }}>{error}</div>}
        <button type="submit" style={{ width: "100%", padding: "0.7em", background: "#388e3c", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600 }}>Login</button>
      </form>
    </div>
  );
}
