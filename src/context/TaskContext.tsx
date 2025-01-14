//Identified Issues
// 1. Invalid status for "Initial Task"
// 2  State are change directly in deleteTask
// 3. Lack of validation and error handling in Context

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { Task } from "../types/task";
import { v4 as uuidv4 } from "uuid";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  filterTasks: (status?: Task["status"], priority?: Task["priority"]) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to manage tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: uuidv4(),
      title: "Initial Task",
      status: "todo", // Fixed invalid status
      priority: "medium",
      createdAt: new Date(),
      description: "This is a sample task to start with",
    },
    {
      id: uuidv4(),
      title: "Second Task",
      status: "todo",
      priority: "high",
      createdAt: new Date(),
      description: "This is another task",
    },
  ]);

  // Validate helper for task data
  const validateTaskData = (taskData: Partial<Task>) => {
    if (taskData.title && taskData.title.length > 100) {
      throw new Error("Task title is too long (max 100 characters).");
    }
    if (
      taskData.status &&
      !["todo", "in-progress", "done"].includes(taskData.status)
    ) {
      throw new Error("Invalid status.");
    }
    if (
      taskData.priority &&
      !["low", "medium", "high"].includes(taskData.priority)
    ) {
      throw new Error("Invalid priority.");
    }
  };

  // Add Task
  const addTask = useCallback(
    (taskData: Omit<Task, "id" | "createdAt">) => {
      try {
        validateTaskData(taskData);
        //Check for duplicate titles
        if (tasks.some((task) => task.title === taskData.title)) {
          throw new Error("Task title must be unique.");
        }

        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date(),
          status: taskData.status || "todo",
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to add task:", error.message);
          alert(error.message);
        } else {
          console.error("Unknown error:", error);
          alert("An unexpected error occurred.");
        }
      }
    },
    [tasks]
  );
  // Update Task
  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      try {
        validateTaskData(updates);

        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
          throw new Error("Task not found.");
        }

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          )
        );
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to update task:", error.message);
          alert(error.message);
        } else {
          console.error("Unknown error:", error);
          alert("An unexpected error occurred.");
        }
      }
    },
    [tasks]
  );

  //State are change directly in deleteTask
  // A better approach is to use filter() to create a new array without mutating the existing state.
  // Delete Task
  const deleteTask = useCallback(
    (id: string) => {
      try {
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
          throw new Error("Task not found.");
        }

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to delete task:", error.message);
          alert(error.message);
        } else {
          console.error("Unknown error:", error);
          alert("An unexpected error occurred.");
        }
      }
    },
    [tasks]
  );
  //Filter tasks based on status and priority
  const filterTasks = useCallback(
    (status?: Task["status"], priority?: Task["priority"]) => {
      return tasks.filter(
        (task) =>
          (!status || task.status === status) &&
          (!priority || task.priority === priority)
      );
    },
    [tasks]
  );
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      deleteTask,
      filterTasks,
    }),
    [tasks, addTask, updateTask, deleteTask, filterTasks]
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
