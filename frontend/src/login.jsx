import { useState } from "react"
import { Link } from "react-router-dom"
import API from "./api"

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [showPass, setShowPass] = useState(false)

  const login = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await API.post("/auth/login", { email, password })
      onLogin(res.data.access_token)
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") login()
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, Arial, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>

      <div style={{
        position: "absolute", width: 500, height: 500,
        borderRadius: "50%", top: -120, left: -120,
        background: "radial-gradient(circle, #00e5ff15 0%, transparent 70%)"
      }} />

      <div style={{
        position: "absolute", width: 400, height: 400,
        borderRadius: "50%", bottom: -120, right: -120,
        background: "radial-gradient(circle, #7b2fff15 0%, transparent 70%)"
      }} />

      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(#ffffff08 1px, transparent 1px)",
        backgroundSize: "30px 30px"
      }} />

      <div style={{
        width: 420, padding: "40px 36px",
        background: "#0d0d15", border: "1px solid #1e1e2e",
        borderRadius: 20, zIndex: 2, position: "relative"
      }}>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            margin: "0 auto 14px",
            background: "linear-gradient(135deg,#00e5ff,#7b2fff)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 22
          }}>⚡</div>

          <h1 style={{ color: "#fff", fontSize: 22, margin: 0 }}>
            AI<span style={{ color: "#00e5ff" }}>Tracker</span>
          </h1>

          <p style={{ fontSize: 12, color: "#6060a0", marginTop: 6 }}>
            Track your job applications with AI
          </p>
        </div>

        {error && (
          <div style={{
            background: "#ff555515", border: "1px solid #ff555540",
            color: "#ff5555", padding: "10px 12px",
            borderRadius: 8, fontSize: 13, marginBottom: 15
          }}>
            ⚠ {error}
          </div>
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError("") }}
          onKeyDown={handleKey}
          style={{
            width: "100%", padding: "12px", marginBottom: 12,
            background: "#07070f", border: "1px solid #1e1e2e",
            borderRadius: 10, color: "#fff", outline: "none",
            boxSizing: "border-box"
          }}
        />

        <div style={{ position: "relative", marginBottom: 18 }}>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError("") }}
            onKeyDown={handleKey}
            style={{
              width: "100%", padding: "12px",
              background: "#07070f", border: "1px solid #1e1e2e",
              borderRadius: 10, color: "#fff", outline: "none",
              boxSizing: "border-box"
            }}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              background: "transparent",
              border: "none",
              color: "#6060a0",
              cursor: "pointer"
            }}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          onClick={login}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: loading ? "#007a8a" : "#00e5ff",
            color: "#0a0a0f",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Signing in..." : "Login →"}
        </button>

        <p style={{
          textAlign: "center",
          fontSize: 12,
          color: "#6060a0",
          marginTop: 18
        }}>
          Don't have an account?{" "}

          <Link
            to="/register"
            style={{
              color: "#00e5ff",
              cursor: "pointer",
              textDecoration: "none"
            }}
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}