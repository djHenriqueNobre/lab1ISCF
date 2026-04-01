"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts"

export default function Home() {
  const [data, setData] = useState([])
  const [intervalTime, setIntervalTime] = useState(1000)
  const [report, setReport] = useState(null)

  // 🔄 Buscar dados do Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("sensor")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50)

      if (!error && data) {
        setData(data)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, intervalTime)

    return () => clearInterval(interval)
  }, [intervalTime])

  // 📊 Função para gerar relatório
  const generateReport = () => {
    if (data.length === 0) return

    const valuesX = data.map(d => d.x).filter(v => v !== null)
    const valuesY = data.map(d => d.y).filter(v => v !== null)
    const valuesZ = data.map(d => d.z).filter(v => v !== null)

    const calcStats = (arr) => ({
      avg: arr.reduce((a, b) => a + b, 0) / arr.length,
      min: Math.min(...arr),
      max: Math.max(...arr)
    })

    const reportData = {
      X: calcStats(valuesX),
      Y: calcStats(valuesY),
      Z: calcStats(valuesZ),
      total_samples: data.length,
      generated_at: new Date().toISOString()
    }

    setReport(reportData)
  }

  // ⬇️ Download do relatório
  const downloadReport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json"
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "report.json"
    a.click()
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Accelerometer Dashboard</h1>

      {/* ⏱️ Intervalo */}
      <label>Update interval (ms): </label>
      <input
        type="number"
        value={intervalTime}
        onChange={(e) => setIntervalTime(Number(e.target.value))}
      />

      {/* 📊 Gráficos */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        {/* X */}
        <div>
          <h2>X Axis</h2>
          <LineChart width={400} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="created_at"
              tickFormatter={(v) => new Date(v).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="x" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Y */}
        <div>
          <h2>Y Axis</h2>
          <LineChart width={400} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="created_at"
              tickFormatter={(v) => new Date(v).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#82ca9d" />
          </LineChart>
        </div>

        {/* Z */}
        <div>
          <h2>Z Axis</h2>
          <LineChart width={400} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="created_at"
              tickFormatter={(v) => new Date(v).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="z" stroke="#ff7300" />
          </LineChart>
        </div>
      </div>

      {/* 📄 Botões */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={generateReport}>Generate Report</button>

        {report && (
          <>
            <pre>{JSON.stringify(report, null, 2)}</pre>
            <button onClick={downloadReport}>Download Report</button>
          </>
        )}
      </div>
    </div>
  )
}