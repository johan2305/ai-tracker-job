import { useState, useEffect } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"

import Login from "./login"
import Register from "./register"
import Dashboard from "./dashboard"

export default function App() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")

    if (
      savedToken &&
      savedToken !== "undefined" &&
      savedToken !== "null"
    ) {
      setToken(savedToken)
    }

    setLoading(false)
  }, [])

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  if (loading) {
    return (
      <div
        style={{
          background: "#0a0a0f",
          color: "#00e5ff",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        Loading...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            token
              ? <Dashboard token={token} onLogout={handleLogout} />
              : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            token
              ? <Dashboard token={token} onLogout={handleLogout} />
              : <Navigate to="/" />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}