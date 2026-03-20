"use client"
import { Plus } from "lucide-react";
import { useState, useEffect } from "react"
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from "@dnd-kit/core"
import Column from "./Column"

type Task = {
  id: number
  title: string
  description: string
  date: string
  time: string
  status: string
  priority: "low" | "medium" | "high"
}
const inputStyle = "p-2 border border-blue-500 rounded w-full text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-400";

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: "medium" as "low" | "medium" | "high"
  })
  
  useEffect(() => {
    const saved = localStorage.getItem("tasks")
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  function addTask() {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      date: newTask.date,
      time: newTask.time,
      status: "todo",
      priority: newTask.priority
    }

    setTasks(prev => [...prev, task])

    setNewTask({
      title: "",
      description: "",
      date: "",
      time: "",
      priority: "medium"
    })

    setShowForm(false)
  }

  function deleteTask(id: number) {
    if (!confirm("Tem certeza que deseja excluir?")) return
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  function openEditModal(task: Task) {
    setEditingTask(task)
  }

  function saveEditTask(updatedTask: Task) {
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    )
    setEditingTask(null)
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = Number(event.active.id)
    const task = tasks.find(t => t.id === taskId)
    if (task) setActiveTask(task)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = Number(active.id)
    const newStatus = over.id as string

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 min-h-screen">

  <div className="w-full bg-white/60 backdrop-blur-lg border-b border-white/30 px-6 py-3 flex items-center justify-between shadow-sm">

    {/* ESQUERDA */}
    <div className="flex items-center gap-6 text-gray-800">

      <span className="text-lg font-bold tracking-tight">
        📋 Task Planner
      </span>

      <div className="flex gap-2">
        <button className="hover:bg-blue-200 px-3 py-1 rounded-md transition">
          Boards
        </button>

        <button className="hover:bg-blue-200 px-3 py-1 rounded-md transition">
          Projetos
        </button>
      </div>
    </div>

    {/* CENTRO (BUSCA) */}
    <div className="flex-1 flex justify-center">
      <input
        placeholder="🔍 Buscar tarefas..."
        className="w-80 bg-white/70 backdrop-blur px-4 py-2 rounded-lg outline-none 
        text-gray-800 placeholder-gray-500 border border-gray-200 
        focus:ring-2 focus:ring-blue-400 transition"
      />
    </div>

  {/* DIREITA */}
  <div className="flex items-center gap-4 text-gray-700">

    <button className="hover:bg-blue-200 p-2 rounded-full transition">
      🔔
    </button>

    <button className="hover:bg-blue-200 p-2 rounded-full transition">
      👤
    </button>

  </div>

</div>

      {/* CONTEÚDO */}
      <div className="p-6">

        {/* HEADER */}
        <div className="mb-6 text-gray-900">
        <h1 className="text-3xl font-bold">Seu painel de tarefas</h1>
        <p className="text-sm text-black-500">
          Tudo o que você precisa para se manter organizado, em um só lugar.
        </p>
        </div>

        {/* BOTÃO */}
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow flex items-center gap-2"
        >
          {showForm ? (
            <>✖ Fechar</>
          ) : (
            <>
              <Plus size={18} />
              Nova tarefa
            </>
          )}
        </button>
        {/* FORM */}
        {showForm && (
          <div className="flex flex-col gap-2 mb-6 max-w-md bg-white p-6 rounded-xl shadow border border-gray-300">

            <input
              placeholder="Título"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className={inputStyle}
            />

            <input
              placeholder="Descrição"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className={inputStyle}
            />

            <div className="flex gap-2">
              <input
                type="date"
                value={newTask.date}
                onChange={(e) =>
                  setNewTask({ ...newTask, date: e.target.value })
                }
                className={inputStyle}
              />
              <input
                type="time"
                value={newTask.time}
                onChange={(e) =>
                  setNewTask({ ...newTask, time: e.target.value })
                }
                className={inputStyle}
              />
            </div>

            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value as any })
              }
              className={inputStyle}
            >
              <option value="low">🟢 Baixa</option>
              <option value="medium">🟡 Média</option>
              <option value="high">🔴 Alta</option>
            </select>

            <button
              onClick={addTask}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Adicionar
            </button>

          </div>
        )}

        {/* BOARD */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto p-4">
            <Column title="A Fazer" status="todo" tasks={tasks} deleteTask={deleteTask} openEditModal={openEditModal} />
            <Column title="Em Progresso" status="doing" tasks={tasks} deleteTask={deleteTask} openEditModal={openEditModal} />
            <Column title="Concluído" status="done" tasks={tasks} deleteTask={deleteTask} openEditModal={openEditModal} />
          </div>

          {/* DRAG OVERLAY */}
          <DragOverlay>
            {activeTask && (
              <div className="bg-white p-4 rounded-xl shadow-lg w-64 text-gray-800">
                {activeTask.title}
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {/* MODAL */}
        {editingTask && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={() => setEditingTask(null)}
          >
            <div
              className="bg-white p-6 rounded-xl w-96 flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-bold text-lg text-gray-800">
                Editar tarefa
              </h2>

              <input
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
                className="p-2 border border-gray-300 rounded text-gray-800"
              />

              <input
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, description: e.target.value })
                }
                className="p-2 border border-gray-300 rounded text-gray-800"
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  value={editingTask.date}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, date: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded w-full text-gray-800"
                />

                <input
                  type="time"
                  value={editingTask.time}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, time: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded w-full text-gray-800"
                />
              </div>

              <select
                value={editingTask.priority}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    priority: e.target.value as any
                  })
                }
                className="p-2 border border-gray-300 rounded text-gray-800"
              >
                <option value="low">🟢 Baixa</option>
                <option value="medium">🟡 Média</option>
                <option value="high">🔴 Alta</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingTask(null)}
                  className="px-3 py-1 bg-blue-400 rounded"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => saveEditTask(editingTask)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Salvar
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}