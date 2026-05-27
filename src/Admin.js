import { useState } from "react";

const BACKEND_URL = "https://cold-mail-backend-ud8p.onrender.com";
const ADMIN_PASSWORD = "shourya123";

export default function Admin() {
  const [liAt, setLiAt] = useState("");
  const [jsessionid, setJsessionid] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!liAt) { alert("li_at is required!"); return; }
    setLoading(true);
    setStatus("Updating cookies...");
    try {
      const res = await fetch(`${BACKEND_URL}/update-cookies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: ADMIN_PASSWORD,
          li_at: liAt,
          jsessionid: jsessionid
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus("✅ " + data.message);
      } else {
        setStatus("❌ " + data.error);
      }
    } catch (e) {
      setStatus("❌ Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 20 }}>
      <div style={{ background: "white", borderRadius: 16, padding: 40, width: "100%", maxWidth: 500, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>🔧 Admin — Update LinkedIn Cookies</h1>
        <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
          Open LinkedIn in Brave → F12 → Application → Cookies → linkedin.com → copy li_at and JSESSIONID values
        </p>

        <label style={labelStyle}>li_at value</label>
        <textarea style={{...inputStyle, height: 80, resize: "vertical"}}
          placeholder="Paste li_at cookie value here"
          value={liAt} onChange={e => setLiAt(e.target.value)} />

        <label style={labelStyle}>JSESSIONID value</label>
        <input style={inputStyle}
          placeholder='Paste JSESSIONID value e.g. "ajax:12345..."'
          value={jsessionid} onChange={e => setJsessionid(e.target.value)} />

        <button style={buttonStyle} onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Cookies"}
        </button>

        {status && (
          <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: status.includes("✅") ? "#f0fdf4" : "#fef2f2", color: status.includes("✅") ? "#166534" : "#dc2626", fontSize: 14 }}>
            {status}
          </div>
        )}

        <p style={{ marginTop: 24, fontSize: 12, color: "#999" }}>
          Note: cookies reset when server restarts. Update them again if scraping stops working.
        </p>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14, color: "#333" };
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none" };
const buttonStyle = { width: "100%", padding: "12px", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer" };
