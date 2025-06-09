"use client"

import React, { useEffect, useState } from "react"

type Log = {
  id: number
  user_id: string
  action: string
  details: any
  timestamp: string
}

type LogsResponse = {
  logs: Log[]
  error?: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Replace this userId with dynamic userId as needed
  // const userId = "01e64cfe-6d56-4f5b-898a-3840ff1f6253"
  const userId = localStorage.getItem("userid")

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/logs?user_id=${userId}`)
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || "Failed to fetch logs")
        }
        const data: LogsResponse = await res.json()
        setLogs(data.logs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [userId])

  function formatTimestamp(ts: string) {
    const d = new Date(ts)
    return d.toLocaleString()
  }

  function renderDetails(details: any) {
    // Pretty-print JSON with indentation and line breaks
    return (
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 200,
          overflow: "auto",
          fontSize: "0.85rem",
          backgroundColor: "#f9f9f9",
          padding: 8,
          borderRadius: 4,
        }}
      >
        {JSON.stringify(details, null, 2)}
      </pre>
    )
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h1>User Activity Logs</h1>

      {loading && <p>Loading logs...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && logs.length === 0 && <p>No logs found.</p>}

      {!loading && !error && logs.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 20,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Action</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Timestamp</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(({ id, action, timestamp, details }) => (
              <tr key={id}>
                <td style={{ border: "1px solid #ccc", padding: "8px", verticalAlign: "top" }}>
                  {id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px", verticalAlign: "top" }}>
                  {action}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px", verticalAlign: "top" }}>
                  {formatTimestamp(timestamp)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px", verticalAlign: "top" }}>
                  {renderDetails(details.message)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
