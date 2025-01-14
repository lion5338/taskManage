// TODO: create a form to add new task
import React, { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { Task } from "../types/task";

const TaskForm: React.FC = () => {
  // Destructure addTask from TaskContext
  const { addTask } = useTasks();

  // State hooks to manage form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [priority, setPriority] = useState<Task["priority"]>("low");

  const handleAddTask = () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    // Use the context function to add task
    addTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
    });

    // Reset form  after submission
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("low");
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-3">Add New Task</h2>
      <div className="mb-2">
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 w-full rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-1 w-full rounded"
        ></textarea>
      </div>
      <div className="mb-2">
        <label className="block font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
          className="border p-1 w-full rounded"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block font-medium">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task["priority"])}
          className="border p-1 w-full rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button
        onClick={handleAddTask}
        className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </div>
  );
};

export default TaskForm;
