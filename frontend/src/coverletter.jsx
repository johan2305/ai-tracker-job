import { useState } from "react"
import API from "./api"

export default function CoverLetter({ job, onClose }) {
  const [letter, setLetter] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setLoading(true)
    setError("")
    setLetter("")

    try {
      const res = await API.post("/ai/cover-letter", {
        company: job.company,
        position: job.position,
        notes: job.notes || ""
      })

      console.log("✅ BACKEND RESPONSE:", res.data)

      if (res.data?.letter) {
        setLetter(res.data.letter)
      } 
      else if (res.data?.error) {
        setError(res.data.error)
      } 
      else {
        setError("Unexpected response from server")
      }

    } catch (err) {
      console.log("❌ FULL ERROR:", err.response?.data || err.message)

      const backendError =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.response?.data?.message

      setError(backendError || "Connection error or unauthorized request")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!letter) return
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "#00000099",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 20
      }}
    >
      <div
        style={{
          background: "#0d0d15",
          border: "1px solid #2e2e4e",
          borderRadius: 16,
          padding: 28,
          width: 560,
          maxWidth: "95vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 16, color: "#fff", margin: 0 }}>
              ✨ Cover Letter Generator
            </h2>
            <p style={{ fontSize: 12, color: "#6060a0", margin: "4px 0 0" }}>
              {job.company} — {job.position}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#6060a0",
              fontSize: 20,
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>

        {/* BUTTON GENERATE */}
        {!letter && (
          <button
            onClick={generate}
            disabled={loading}
            style={{
              padding: "12px",
              borderRadius: 10,
              border: "none",
              background: loading
                ? "#333"
                : "linear-gradient(135deg, #00e5ff, #7b2fff)",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "✨ Generating..." : "✨ Generate Cover Letter"}
          </button>
        )}

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#ff555518",
              border: "1px solid #ff555533",
              borderRadius: 8,
              padding: "10px 14px",
              color: "#ff5555",
              fontSize: 13
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", color: "#4040a0" }}>
            <div>AI is writing your letter...</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#00e5ff",
                    animation: `bounce 1s ${i * 0.2}s infinite`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* RESULT */}
        {letter && (
          <>
            <textarea
              readOnly
              value={letter}
              style={{
                flex: 1,
                minHeight: 280,
                background: "#07070f",
                border: "1px solid #1e1e2e",
                borderRadius: 10,
                padding: 14,
                color: "#c8c8e0",
                fontSize: 13,
                lineHeight: 1.7,
                resize: "none",
                outline: "none"
              }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={generate}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #1e1e2e",
                  background: "transparent",
                  color: "#9090b0",
                  cursor: "pointer"
                }}
              >
                🔄 Regenerate
              </button>

              <button
                onClick={copyToClipboard}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  border: "none",
                  background: copied ? "#00e67622" : "#00e5ff",
                  color: copied ? "#00e676" : "#0a0a0f",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy Letter"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}