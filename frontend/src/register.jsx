import { useState } from "react"
import API from "./api"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const register = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password
      })

      setMessage("Account created successfully 🎉")

      setTimeout(() => {
        window.location.href = "/"
      }, 1500)

    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data)
      setError(err.response?.data?.detail || "Error creating account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, Arial, sans-serif"
    }}>

      <div style={{
        width: 420,
        padding: "40px",
        background: "#0d0d15",
        border: "1px solid #1e1e2e",
        borderRadius: 20
      }}>

        <h1 style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: 20
        }}>
          Create Account
        </h1>

        {error && (
          <div style={{
            color: "#ff5555",
            marginBottom: 10,
            fontSize: 13
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            color: "#00e5ff",
            marginBottom: 10,
            fontSize: 13
          }}>
            {message}
          </div>
        )}

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: 12,
            background: "#07070f",
            border: "1px solid #1e1e2e",
            borderRadius: 10,
            color: "#fff"
          }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: 12,
            background: "#07070f",
            border: "1px solid #1e1e2e",
            borderRadius: 10,
            color: "#fff"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: 18,
            background: "#07070f",
            border: "1px solid #1e1e2e",
            borderRadius: 10,
            color: "#fff"
          }}
        />

        <button
          onClick={register}
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
          {loading ? "Creating account..." : "Register"}
        </button>

        <p style={{
          textAlign: "center",
          marginTop: 18,
          color: "#6060a0",
          fontSize: 13
        }}>
          Already have an account?{" "}
          <span
            onClick={() => window.location.href = "/"}
            style={{ color: "#00e5ff", cursor: "pointer" }}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  )
}