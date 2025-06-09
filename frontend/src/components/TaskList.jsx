import { useState } from 'react';
import axios from 'axios';

function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = (task) => {
    setEditingTask({ ...task });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        editingTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskUpdated(res.data);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskDeleted(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const updatedTask = {
        ...task,
        status: task.status === 'pending' ? 'completed' : 'pending',
      };
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskUpdated(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-4 mb-4 rounded-lg shadow-md flex justify-between items-center"
        >
          {editingTask && editingTask._id === task._id ? (
            <form onSubmit={handleUpdate} className="w-full">
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, description: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              ></textarea>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="w-full">
              <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleStatusToggle(task)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Toggle Status
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default TaskList;