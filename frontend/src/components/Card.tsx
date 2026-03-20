import { useDraggable } from "@dnd-kit/core"

type Task = {
  id: number
  title: string
  description: string
  date: string
  time: string
  status: string
  priority: "low" | "medium" | "high"
}

type CardProps = {
  task: Task
  deleteTask: (id: number) => void
  openEditModal: (task: Task) => void
}

export default function Card({
  task,
  deleteTask,
  openEditModal
}: CardProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id
  })

  // Borda lateral
  const priorityColor = {
    low: "border-l-4 border-green-400",
    medium: "border-l-4 border-yellow-400",
    high: "border-l-4 border-red-400"
  }

  //  Badge da prioridade 
  const priorityStyle = {
    low: "bg-green-500/10 text-green-600 border border-green-200",
    medium: "bg-yellow-500/10 text-yellow-600 border border-yellow-200",
    high: "bg-red-500/10 text-red-600 border border-red-200"
  }

  return (
    <div
      ref={setNodeRef}
      className={`bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col gap-2 border border-gray-200 ${priorityColor[task.priority]}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">

        {/* DRAG HANDLE */}
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing font-semibold text-gray-800 flex-1"
        >
          {task.title}
        </div>

        {/* ACTIONS */}
        <div
          className="flex gap-2 ml-2"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              openEditModal(task)
            }}
            className="text-blue-500 hover:scale-110 hover:text-blue-600 transition"
          >
            ✏️
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteTask(task.id)
            }}
            className="text-red-500 hover:scale-110 hover:text-red-600 transition"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* DESCRIPTION */}
      {task.description && (
        <p className="text-sm text-gray-600">
          {task.description}
        </p>
      )}

      {/* PRIORIDADE */}
      <div
        className={`self-start px-2 py-1 rounded-full text-xs font-medium ${priorityStyle[task.priority]}`}
      >
        {task.priority === "high" && "🔴 Alta"}
        {task.priority === "medium" && "🟡 Média"}
        {task.priority === "low" && "🟢 Baixa"}
      </div>

      {/* DATA */}
      {(task.date || task.time) && (
        <div className="text-xs text-gray-500 flex justify-between">
          <span>📅 {task.date}</span>
          <span>⏰ {task.time}</span>
        </div>
      )}
    </div>
  )
}