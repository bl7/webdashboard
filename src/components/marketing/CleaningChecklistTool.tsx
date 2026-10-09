"use client"

import { useMemo, useState } from "react"

type Task = { area: string; task: string; frequency: string; method: string }

const STARTER: Task[] = [
  { area: "Preparation", task: "Work surfaces", frequency: "Daily", method: "" },
  { area: "Wash-up", task: "Sinks and cloths", frequency: "Daily", method: "" },
  { area: "Storage", task: "Fridge shelves", frequency: "Weekly", method: "" },
  { area: "Extraction", task: "Filters and canopies", frequency: "Monthly", method: "" },
]

export function CleaningChecklistTool() {
  const [tasks, setTasks] = useState<Task[]>(STARTER)
  const [kitchen, setKitchen] = useState("")
  const [date, setDate] = useState("")

  const csv = useMemo(() => {
    const header = ["Kitchen", "Date", "Area", "Task", "Frequency", "Method"]
    const lines = tasks.map((task) =>
      [kitchen, date, task.area, task.task, task.frequency, task.method].map(csvCell).join(",")
    )
    return [header.map(csvCell).join(","), ...lines].join("\n")
  }, [date, kitchen, tasks])

  const update = (index: number, key: keyof Task, value: string) => {
    setTasks((current) => current.map((task, taskIndex) => (taskIndex === index ? { ...task, [key]: value } : task)))
  }

  const download = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "restaurant-cleaning-checklist.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink">Edit the checklist</h2>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-mkt-ink8">
            Kitchen
            <input
              className="mt-1 w-full rounded-md border border-mkt-steel1 bg-white px-3 py-2"
              value={kitchen}
              onChange={(event) => setKitchen(event.target.value)}
            />
          </label>
          <label className="text-sm text-mkt-ink8">
            Date
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-mkt-steel1 bg-white px-3 py-2"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        </div>
        <ul className="space-y-4">
          {tasks.map((task, index) => (
            <li key={index} className="grid gap-3 rounded-lg border border-mkt-steel1 bg-white p-4 sm:grid-cols-4">
              {(["area", "task", "frequency", "method"] as const).map((key) => (
                <label key={key} className="text-xs font-semibold uppercase tracking-wide text-mkt-steel">
                  {key}
                  <input
                    className="mt-1 w-full rounded border border-mkt-steel1 px-2 py-2 text-sm font-normal normal-case tracking-normal text-mkt-ink"
                    value={task[key]}
                    onChange={(event) => update(index, key, event.target.value)}
                  />
                </label>
              ))}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md border border-mkt-ink px-4 py-2 text-sm font-semibold text-mkt-ink"
            onClick={() => setTasks((current) => [...current, { area: "", task: "", frequency: "Daily", method: "" }])}
          >
            Add a task
          </button>
          <button type="button" className="rounded-md bg-mkt-ink px-4 py-2 text-sm font-semibold text-white" onClick={download}>
            Download CSV
          </button>
          <button
            type="button"
            className="rounded-md border border-mkt-ink px-4 py-2 text-sm font-semibold text-mkt-ink"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>
      </div>
    </section>
  )
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}
