import type { Task } from "@/types/task"

const API_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_URL) {
  console.warn(
    "NEXT_PUBLIC_API_URL não está definida. Configure-a em um arquivo .env.local (veja .env.example)."
  )
}

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`)
  if (!res.ok) throw new Error("Erro ao buscar tarefas")
  return res.json()
}

export async function createTask(data: Omit<Task, "id">): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao criar tarefa")
  return res.json()
}

export async function updateTask(id: number, data: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Erro ao atualizar tarefa")
  return res.json()
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Erro ao deletar tarefa")
}