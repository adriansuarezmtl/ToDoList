import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';

function LifeCycleDemo(){
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Montado");
    return() => {
      console.log("desmontado");
    }
  }, []);

  useEffect(() => {
    console.log("Actualizado:, count");
  }, [count]);

  return(
    <div>
      <h1>Contador:{count}</h1>
      <button onClick={() => setCount(count +1)}>incrementar</button>
    </div>
  )
}

//componente TaksForm "formulario"
function TaksForm({ taskText, setTaskText, addTask, isEditing, cancelEdit }) {
  return (
    <div className="input-group mb-3">
      <input type="text"
        className="form-control"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Agregar tarea">
      </input>
      <button className={`btn ${isEditing ?"btn-warning":"btn-primary"}`} 
      onClick={addTask}>{isEditing ?"Actualizar":"Agregar"}</button>
      {isEditing && (<button className="btn btn-secondary" 
      onClick={cancelEdit}>Cancelar
      </button>
      )}
    </div>
  );
}

//componenete TaskApp
function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editing, setEditing] = useState(null);

  const addTask = () => {
    if (taskText.trim()) {
      if(editing) {
        setTasks(tasks.map((task) =>
        task.id === editing ? {...task, text:taskText}:task
        )
      );
      setEditing (null);
      }
      else {
        setTasks([...tasks, { id: Date.now(), text: taskText, completed: false }]);
      }
      setTaskText("");
    }
  }

  const updateTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setTaskText(taskToEdit.text);
      setEditing(id);
    }
  }

  const cancelEdit = () => {
    setTaskText("");
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
      <LifeCycleDemo></LifeCycleDemo>
      <TaksForm taskText={taskText} setTaskText={setTaskText} addTask={addTask}
      isEditing={Boolean(editing)} cancelEdit={cancelEdit}
      />
      <table className="table table-striped table-bordered">
        <thead className="table-light">
          <tr>
            <th>Nombre de la Tarea</th>
            <th className="text-center">Completada</th>
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

export default TaskApp;