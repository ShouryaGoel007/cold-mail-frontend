
import { useState } from "react";

const BACKEND_URL = "https://cold-mail-backend-ud8p.onrender.com/";
// ☝️ You will update this after deploying backend

export default function App() {
  const [step, setStep] = useState(1);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [hrName, setHrName] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [resume, setResume] = useState(null);
  const [emailPreview, setEmailPreview] = useState(null);
  const [hrEmail, setHrEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (!linkedinUrl || !userProfile) {
      alert("Please fill in LinkedIn URL and your profile!");
      return;
    }
    setLoading(true);
    setMessage("🤖 AI is writing your email...");
    try {
      const res = await fetch(`${BACKEND_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedin_url: linkedinUrl, hr_name: hrName, user_profile: userProfile })
      });
      const data = await res.json();
      if (data.success) {
        setEmailPreview(data);
        setHrEmail(data.hr_email || "");
        setStep(2);
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Could not connect to server: " + e.message);
    }
    setLoading(false);
    setMessage("");
  };

  const handleSend = async () => {
    if (!resume) { alert("Please upload your resume!"); return; }
    if (!hrEmail) { alert("Please enter HR email!"); return; }
    setLoading(true);
    setMessage("📤 Sending email...");
    try {
      const formData = new FormData();
      formData.append("hr_email", hrEmail);
      formData.append("subject", emailPreview.subject);
      formData.append("body", emailPreview.email_body);
      formData.append("resume", resume);
      const res = await fetch(`${BACKEND_URL}/send`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Email sent successfully!");
        setStep(3);
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 40, width: "100%", maxWidth: 560, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🚀 Cold Mail Bot</h1>
        <p style={{ color: "#666", marginBottom: 32 }}>Paste a LinkedIn post, get a personalized email sent automatically.</p>

        {step === 1 && (
          <div>
            <label style={labelStyle}>LinkedIn Post URL</label>
            <input style={inputStyle} placeholder="https://www.linkedin.com/posts/..." value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} />

            <label style={labelStyle}>HR Name (optional)</label>
            <input style={inputStyle} placeholder="e.g. Priya Sharma" value={hrName} onChange={e => setHrName(e.target.value)} />

            <label style={labelStyle}>Your Profile</label>
            <textarea style={{ ...inputStyle, height: 100, resize: "vertical" }}
              placeholder="My name is Shourya. I am a final year student at IIT BHU. My skills are Python, ML..."
              value={userProfile} onChange={e => setUserProfile(e.target.value)} />

            <label style={labelStyle}>Your Resume (PDF)</label>
            <input type="file" accept=".pdf" onChange={e => setResume(e.target.files[0])}
              style={{ display: "block", marginBottom: 24, color: "#444" }} />

            <button style={buttonStyle} onClick={handleGenerate} disabled={loading}>
              {loading ? message : "✨ Generate Email"}
            </button>
          </div>
        )}

        {step === 2 && emailPreview && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>📧 Email Preview</h2>

            <label style={labelStyle}>HR Email</label>
            <input style={inputStyle} value={hrEmail} onChange={e => setHrEmail(e.target.value)}
              placeholder="Enter HR email if not auto-detected" />

            <label style={labelStyle}>Subject</label>
            <input style={inputStyle} value={emailPreview.subject}
              onChange={e => setEmailPreview({ ...emailPreview, subject: e.target.value })} />

            <label style={labelStyle}>Email Body (you can edit this)</label>
            <textarea style={{ ...inputStyle, height: 180, resize: "vertical" }}
              value={emailPreview.email_body}
              onChange={e => setEmailPreview({ ...emailPreview, email_body: e.target.value })} />

            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ ...buttonStyle, background: "#eee", color: "#333", flex: 1 }}
                onClick={() => setStep(1)}>← Back</button>
              <button style={{ ...buttonStyle, flex: 2 }} onClick={handleSend} disabled={loading}>
                {loading ? message : "📤 Send Email"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Email Sent!</h2>
            <p style={{ color: "#666", marginBottom: 32 }}>Your cold email was sent successfully.</p>
            <button style={buttonStyle} onClick={() => { setStep(1); setEmailPreview(null); setLinkedinUrl(""); }}>
              Send Another Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontWeight: 600, marginBottom: 6, fontSize: 14, color: "#333" };
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, marginBottom: 16, boxSizing: "border-box", outline: "none" };
const buttonStyle = { width: "100%", padding: "12px", background: "#4f46e5", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer" };
