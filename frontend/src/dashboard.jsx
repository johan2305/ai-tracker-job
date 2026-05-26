import { useEffect, useState } from "react"
import API from "./api"
import CoverLetter from "./CoverLetter"

const STATUS_COLORS = {
  Applied:   { bg: "#00e5ff18", color: "#00e5ff" },
  Interview: { bg: "#ffd60018", color: "#ffd600" },
  Offer:     { bg: "#00e67618", color: "#00e676" },
  Rejected:  { bg: "#ff555518", color: "#ff5555" },
}

const EMPTY_FORM = {
  company: "", position: "", status: "Applied",
  salary: "", job_link: "", notes: ""
}

export default function Dashboard({ onLogout }) {
  const [jobs, setJobs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("All")
  const [search, setSearch]     = useState("")
  const [sortBy, setSortBy]     = useState("newest")
  const [expanded, setExpanded] = useState({})
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editId, setEditId]     = useState(null)
  const [coverJob, setCoverJob] = useState(null)

  useEffect(() => { loadJobs() }, [])

  const loadJobs = async () => {
    try {
      const res = await API.get("/jobs")
      setJobs(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.log(err)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setModal(true)
  }

  const openEdit = (job) => {
    setForm({
      company:  job.company,
      position: job.position,
      status:   job.status,
      salary:   job.salary   || "",
      job_link: job.job_link || "",
      notes:    job.notes    || "",
    })
    setEditId(job.id)
    setModal(true)
  }

  const saveJob = async () => {
    if (!form.company || !form.position) return
    try {
      if (editId) {
        await API.put(`/jobs/${editId}`, form)
      } else {
        await API.post("/jobs", form)
      }
      setModal(false)
      loadJobs()
    } catch (err) {
      console.log(err)
    }
  }

  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/${id}`)
      setJobs(prev => prev.filter(j => j.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric"
    })
  }

  let filtered = jobs
    .filter(j => filter === "All" || j.status === filter)
    .filter(j => {
      const q = search.toLowerCase()
      return (
        j.company.toLowerCase().includes(q) ||
        j.position.toLowerCase().includes(q) ||
        (j.notes || "").toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at)
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at)
      if (sortBy === "company") return a.company.localeCompare(b.company)
      return 0
    })

  if (loading) return (
    <div style={{ background: "#0a0a0f", height: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", color: "#00e5ff",
      fontFamily: "Inter, Arial, sans-serif" }}>
      Loading...
    </div>
  )

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0f",
      color: "#e8e8f0", fontFamily: "Inter, Arial, sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#0d0d15",
        borderRight: "1px solid #1e1e2e", display: "flex",
        flexDirection: "column", padding: "24px 16px", gap: 4, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10,
          padding: "0 8px", marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #00e5ff, #7b2fff)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
            AI<span style={{ color: "#00e5ff" }}>Tracker</span>
          </span>
        </div>

        {[
          { label: "Dashboard", active: true },
          { label: "Add Job",   action: openAdd },
          { label: "Applications" },
          { label: "Analytics" },
        ].map(item => (
          <button key={item.label} onClick={item.action}
            style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, border: "none",
              background: item.active ? "#1a1a2e" : "transparent",
              color: item.active ? "#00e5ff" : "#9090b0",
              cursor: "pointer", fontSize: 13, textAlign: "left" }}>
            {item.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <button onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, border: "none",
            background: "#1a0a0a", color: "#ff5555",
            cursor: "pointer", fontSize: 13 }}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* TOPBAR */}
        <div style={{ display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "20px 28px 16px",
          borderBottom: "1px solid #1e1e2e" }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "#fff" }}>My Applications</h1>
          <button onClick={openAdd}
            style={{ display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", background: "#00e5ff", color: "#0a0a0f",
              border: "none", borderRadius: 8, fontSize: 13,
              fontWeight: 600, cursor: "pointer" }}>
            + Add Job
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)",
            gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total",      val: jobs.length,                                        color: "#fff"    },
              { label: "Applied",    val: jobs.filter(j => j.status === "Applied").length,    color: "#00e5ff" },
              { label: "Interviews", val: jobs.filter(j => j.status === "Interview").length,  color: "#ffd600" },
              { label: "Offers",     val: jobs.filter(j => j.status === "Offer").length,      color: "#00e676" },
            ].map(s => (
              <div key={s.label} style={{ background: "#0d0d15",
                border: "1px solid #1e1e2e", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#6060a0", textTransform: "uppercase",
                  letterSpacing: ".8px", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* SEARCH + SORT + FILTERS */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <span style={{ position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", color: "#4040a0", fontSize: 15 }}>🔍</span>
              <input
                placeholder="Search company, position, notes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", background: "#0d0d15",
                  border: "1px solid #1e1e2e", borderRadius: 8,
                  padding: "9px 12px 9px 36px", color: "#e8e8f0",
                  fontSize: 13, outline: "none", boxSizing: "border-box" }}
                onFocus={e => e.target.style.borderColor = "#00e5ff44"}
                onBlur={e => e.target.style.borderColor = "#1e1e2e"}
              />
            </div>

            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ background: "#0d0d15", border: "1px solid #1e1e2e",
                borderRadius: 8, padding: "9px 12px", color: "#9090b0",
                fontSize: 13, outline: "none", cursor: "pointer" }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="company">Company A-Z</option>
            </select>

            {["All", "Applied", "Interview", "Offer", "Rejected"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: "9px 14px", borderRadius: 8,
                  border: `1px solid ${filter === f ? "#00e5ff33" : "#1e1e2e"}`,
                  background: filter === f ? "#00e5ff11" : "transparent",
                  color: filter === f ? "#00e5ff" : "#6060a0",
                  fontSize: 12, cursor: "pointer" }}>
                {f}
              </button>
            ))}
          </div>

          {/* RESULTS COUNT */}
          <div style={{ fontSize: 12, color: "#4040a0", marginBottom: 12 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {search && ` for "${search}"`}
          </div>

          {/* JOB LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#4040a0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: 13 }}>
                  {search ? `No results for "${search}"` : "No jobs yet. Add your first application!"}
                </p>
              </div>
            ) : filtered.map(job => (
              <div key={job.id} style={{ background: "#0d0d15",
                border: "1px solid #1e1e2e", borderRadius: 10, overflow: "hidden" }}>

                <div style={{ padding: "14px 18px", display: "flex",
                  alignItems: "center", gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9,
                    background: "#1a1a2e", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏢</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600,
                      color: "#e8e8f0", marginBottom: 2 }}>{job.company}</div>
                    <div style={{ fontSize: 12, color: "#6060a0" }}>
                      {job.position}
                      {job.salary ? ` · $${Number(job.salary).toLocaleString()}` : ""}
                      {job.created_at &&
                        <span style={{ marginLeft: 8, color: "#3030a0" }}>
                          · {formatDate(job.created_at)}
                        </span>}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 20,
                      fontSize: 11, fontWeight: 600,
                      background: STATUS_COLORS[job.status]?.bg || "#ffffff18",
                      color: STATUS_COLORS[job.status]?.color || "#fff" }}>
                      {job.status}
                    </span>

                    <button onClick={() => setCoverJob(job)} title="Generate Cover Letter"
                      style={{ width: 30, height: 30, borderRadius: 6,
                        border: "1px solid #7b2fff44", background: "#7b2fff11",
                        color: "#7b2fff", cursor: "pointer", fontSize: 14 }}>✨</button>

                    {job.notes && (
                      <button onClick={() => toggleExpand(job.id)}
                        style={{ width: 30, height: 30, borderRadius: 6,
                          border: "1px solid #1e1e2e",
                          background: expanded[job.id] ? "#1a1a2e" : "transparent",
                          color: expanded[job.id] ? "#00e5ff" : "#6060a0",
                          cursor: "pointer", fontSize: 14 }}>📝</button>
                    )}

                    {job.job_link && (
                      <a href={job.job_link} target="_blank" rel="noreferrer"
                        style={{ width: 30, height: 30, borderRadius: 6,
                          border: "1px solid #1e1e2e", background: "transparent",
                          color: "#6060a0", fontSize: 14, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          textDecoration: "none" }}>🔗</a>
                    )}

                    <button onClick={() => openEdit(job)}
                      style={{ width: 30, height: 30, borderRadius: 6,
                        border: "1px solid #1e1e2e", background: "transparent",
                        color: "#6060a0", cursor: "pointer", fontSize: 14 }}>✏️</button>

                    <button onClick={() => deleteJob(job.id)}
                      style={{ width: 30, height: 30, borderRadius: 6,
                        border: "1px solid #1e1e2e", background: "transparent",
                        color: "#ff5555", cursor: "pointer", fontSize: 14 }}>🗑️</button>
                  </div>
                </div>

                {expanded[job.id] && job.notes && (
                  <div style={{ padding: "12px 18px 16px",
                    borderTop: "1px solid #1e1e2e", background: "#0a0a12" }}>
                    <div style={{ fontSize: 11, color: "#4040a0", textTransform: "uppercase",
                      letterSpacing: ".7px", marginBottom: 8 }}>Notes</div>
                    <p style={{ fontSize: 13, color: "#9090b0",
                      lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                      {job.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL ADD/EDIT */}
      {modal && (
        <div onClick={e => e.target === e.currentTarget && setModal(false)}
          style={{ position: "fixed", inset: 0, background: "#00000088",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#0d0d15", border: "1px solid #2e2e4e",
            borderRadius: 14, padding: 28, width: 420,
            maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>
              {editId ? "Edit job" : "Add new job"}
            </h2>

            {[
              { label: "Company",  key: "company",  type: "text",   placeholder: "e.g. Google"           },
              { label: "Position", key: "position", type: "text",   placeholder: "e.g. Backend Developer" },
              { label: "Salary",   key: "salary",   type: "number", placeholder: "e.g. 60000"            },
              { label: "Job link", key: "job_link", type: "url",    placeholder: "https://..."            },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: "#6060a0",
                  marginBottom: 6, textTransform: "uppercase", letterSpacing: ".6px" }}>
                  {f.label}
                </label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", background: "#07070f",
                    border: "1px solid #1e1e2e", borderRadius: 8,
                    padding: "9px 12px", color: "#e8e8f0",
                    fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, color: "#6060a0",
                marginBottom: 6, textTransform: "uppercase", letterSpacing: ".6px" }}>
                Status
              </label>
              <select value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                style={{ width: "100%", background: "#07070f",
                  border: "1px solid #1e1e2e", borderRadius: 8,
                  padding: "9px 12px", color: "#e8e8f0", fontSize: 13 }}>
                {["Applied", "Interview", "Offer", "Rejected"].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, color: "#6060a0",
                marginBottom: 6, textTransform: "uppercase", letterSpacing: ".6px" }}>
                Notes
              </label>
              <textarea value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Interview tips, contacts, requirements..."
                style={{ width: "100%", background: "#07070f",
                  border: "1px solid #1e1e2e", borderRadius: 8,
                  padding: "9px 12px", color: "#e8e8f0",
                  fontSize: 13, minHeight: 80, resize: "vertical",
                  boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button onClick={() => setModal(false)}
                style={{ padding: "8px 16px", borderRadius: 8,
                  border: "1px solid #1e1e2e", background: "transparent",
                  color: "#9090b0", cursor: "pointer", fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={saveJob}
                style={{ padding: "8px 20px", borderRadius: 8, border: "none",
                  background: "#00e5ff", color: "#0a0a0f",
                  fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COVER LETTER IA */}
      {coverJob && (
        <CoverLetter job={coverJob} onClose={() => setCoverJob(null)} />
      )}
    </div>
  )
}