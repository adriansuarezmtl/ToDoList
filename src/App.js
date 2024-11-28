import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

//componente TaksForm "formulario"

function TaksForm({ taskText, setTaskText, dueDate, setDuedate, addTask, isEditing, cancelEdit }) {

  return (
    <div className="input-group mb-3">
      <input type="text"
        className="form-control"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Agregar tarea">
      </input>
      <input
        type="datetime-local"
        className="form-control"
        value={dueDate}
        onChange={(e) => setDuedate(e.target.value)}
      ></input>
      <button className={`btn ${isEditing ? "btn-warning" : "btn-primary"}`}
        onClick={addTask}>{isEditing ? "Actualizar" : "Agregar"}</button>
      {isEditing && (<button className="btn btn-secondary"
        onClick={cancelEdit}>Cancelar
      </button>
      )}
    </div>
  );
}

//componenete TaskApp

function TaskApp() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDuedate] = useState("");
  const [editing, setEditing] = useState(null);

  // persistencia con localStorage

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskText.trim()) {
      const now = new Date();
      const selectedDate = new Date(dueDate);
  
      if (dueDate && selectedDate < now) {
  //aquí ponemos la alerta
        alert("La fecha debe ser mayor o igual al día actual.");
        return;
      }
  
      if (editing) {
        setTasks(
          tasks.map((task) =>
            task.id === editing ? { ...task, text: taskText, dueDate } : task
          )
        );
        setEditing(null);
      } else {
        setTasks([
          ...tasks,
          { id: Date.now(), text: taskText, dueDate, completed: false },
        ]);
      }
  
      setTaskText("");
      setDuedate("");
    }
  };


  const updateTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setTaskText(taskToEdit.text);
      setDuedate(taskToEdit.dueDate || "");
      setEditing(id);
    }
  }

  const cancelEdit = () => {
    setTaskText("");
    setDuedate("");
    setEditing(null);
  }

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const tooggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Gestor de Tareas</h1>
      <TaksForm taskText={taskText} setTaskText={setTaskText}
        dueDate={dueDate} setDuedate={setDuedate}
        addTask={addTask} isEditing={Boolean(editing)} cancelEdit={cancelEdit}
      />
      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>Nombre de la Tarea</th>
            <th className="text-center">Completada</th>
            <th className="text-center">Fecha</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            tasks.map((task) => (
              <tr key={task.id}>
                <td className={task.completed ? "text-decoration-line-through" : ""}>
                  {task.text}
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => tooggleComplete(task.id)}>
                  </input>
                </td>
                <td className="text-center">{task.dueDate ? new Date(task.dueDate).toLocaleString() : "-"}</td>
                <td className="text-center">
                  <button className="btn btn-success btn-sm me-2"
                    onClick={() => updateTask(task.id)}>Editar</button>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => removeTask(task.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div >
  )
}

const Home = () => <h2>Página Principal</h2>
const Tasks = () => <TaskApp></TaskApp>
const CompletedTask = () => <h2>Tareas Completadas</h2>
const PendingTask = () => <h2>Tareas Pendientes</h2>

function App(){
  return(
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link> | <Link to="/tasks">Tareas</Link> | 
        <Link to="/completed-tasks">Tareas Completadas</Link> | 
        <Link to="/pending-tasks">Tareas Pendientes</Link>
      </nav>
      <Routes>
        <Route path="/" element ={<Home/>}/>
        <Route path="/tasks" element={<Tasks/>}/>
        <Route path="/completed-tasks" element={<CompletedTask/>}/>
        <Route path="/pending-tasks" element={<PendingTask/>}/>
      </Routes>
    </BrowserRouter>
  );
}

// export default TaskApp;

export default App;