import { useDroppable } from "@dnd-kit/core"
import { memo } from "react"
import Card from "./Card"

type Task = {
  id: number
  title: string
  description: string
  date: string
  time: string
  status: string
  priority: "low" | "medium" | "high"
}

type ColumnProps = {
  title: string
  status: string
  tasks: Task[]
  deleteTask: (id: number) => void
  openEditModal: (task: Task) => void
}

function Column({
  title,
  status,
  tasks,
  deleteTask,
  openEditModal
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status
  })

  const filteredTasks = tasks.filter(task => task.status === status)

  const columnColors = {
    todo: "border-t-4 border-t-blue-400",
    doing: "border-t-4 border-t-yellow-400",
    done: "border-t-4 border-t-green-400"
  }

  return (
    <div
      ref={setNodeRef}
      className={`bg-white/60 backdrop-blur-md p-4 rounded-2xl w-72 flex flex-col gap-3 min-h-[350px] shadow-lg border border-transparent ${columnColors[status]}`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-black">{title}</h2>

        <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
          {filteredTasks.length}
        </span>
      </div>

      {/* CARDS */}
      <div className="flex flex-col gap-2">
        {filteredTasks.length === 0 && (
          <p className="text-xs text-black text-center mt-4">
            Nenhuma tarefa
          </p>
        )}

        {filteredTasks.map(task => (
          <Card
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            openEditModal={openEditModal}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(Column)