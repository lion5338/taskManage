//Identified Issues
// 1. Poor UX pattern when uses window.confirm in TaskList
import React, { useState, useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import { Task } from "../types/task";

export const TaskList: React.FC = () => {
  const { tasks, deleteTask, updateTask } = useTasks();
  // State for filtering tasks by status and priority
  const [filter, setFilter] = useState<{
    status?: Task["status"];
    priority?: Task["priority"];
  }>({});

  // State for managing the confirmation dialog
  const [confirmDelete, setConfirmDelete] = useState<{
    visible: boolean;
    taskId?: string;
    taskTitle?: string;
  }>({ visible: false });

  const openConfirmDialog = (taskId: string, taskTitle: string) => {
    setConfirmDelete({ visible: true, taskId, taskTitle });
  };

  const closeConfirmDialog = () => {
    setConfirmDelete({ visible: false });
  };

  const confirmDeleteTask = () => {
    if (confirmDelete.taskId) {
      deleteTask(confirmDelete.taskId);
    }
    closeConfirmDialog();
  };
  // Filter tasks efficiently based on selected status and priority
  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        (!filter.status || task.status === filter.status) &&
        (!filter.priority || task.priority === filter.priority)
    );
  }, [tasks, filter]);

  const renderTaskActions = (task: Task) => {
    const handleDelete = () => {
      // window.confirm is not user-friendly and does not align with modern UI/UX practices.
      // using custom custon dialog might be a better approach
      openConfirmDialog(task.id, task.title);
    };

    const handleStatusChange = () => {
      // Repeat through statuses: "todo" -> "in-progress" -> "done" -> "todo"
      const statusMap: Record<Task["status"], Task["status"]> = {
        todo: "in-progress",
        "in-progress": "done",
        done: "todo",
      };
      updateTask(task.id, { status: statusMap[task.status] });
    };

    return (
      <>
        <button
          className="border border-black rounded-md p-1"
          onClick={handleStatusChange}
        >
          Change Status
        </button>
        <button
          className="border border-black rounded-md p-1"
          onClick={handleDelete}
        >
          Delete
        </button>
      </>
    );
  };

  return (
    <div>
      {/* 操作欄位 */}
      <h1 className="text-xl font-bold my-3">Control Panel</h1>
      <div className="flex">
        <select
          value={filter.status || ""}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              status: e.target.value as Task["status"],
            }))
          }
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filter.priority || ""}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              priority: e.target.value as Task["priority"],
            }))
          }
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      {/* task 列表 */}
      <h1 className="text-xl font-bold my-3">Task list</h1>
      <div className="flex flex-col">
        {filteredTasks.map((task) => (
          <div className="flex gap-1" key={task.id}>
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            {renderTaskActions(task)}
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {confirmDelete.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <p>
              Are you sure you want to delete task "{confirmDelete.taskTitle}"?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={closeConfirmDialog}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={confirmDeleteTask}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
