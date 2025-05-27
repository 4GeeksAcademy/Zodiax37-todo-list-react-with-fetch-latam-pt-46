import React, { useState, useEffect } from "react";

//create your first component
const TodoLista = () => {
	const [tasks, setTasks] = useState([]);
	const [task, setTask] = useState("");

	useEffect(() => {
		getTodos();
	}, []);

	const createUser = () => {
		fetch('https://playground.4geeks.com/todo/users/Zodiax37', {
			method: 'POST'
		})
			.then(res => {
				if (!res.ok) throw new Error("No se logró crear el usuario");
				return res.json();
			})
			.then(() => getTodos())
			.catch(err => console.log("Error " + err));
	};

	const getTodos = () => {
		fetch('https://playground.4geeks.com/todo/users/Zodiax37')
			.then(res => {
				if (!res.ok) throw new Error("Error al intentar traer las tareas");
				return res.json();
			})
			.then(data => setTasks(data.todos))
			.catch(() => createUser());
	};

	const addTask = (taskText) => {
		fetch('https://playground.4geeks.com/todo/todos/Zodiax37', {
			method: 'POST',
			body: JSON.stringify({
				label: taskText,
				is_done: false
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(res => {
				if (!res.ok) throw new Error("Error al crear tarea");
				return res.json();
			})
			.then(() => getTodos())
			.catch(err => console.log(err));
	};

	const handleEnter = (event) => {
		if (event.key === "Enter" && task.trim() !== "") {
			addTask(task.trim());
			setTask("");
		}
	};

	const deleteTasks = id => {
		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: 'DELETE',
		})
			.then(res => {
				if (!res.ok) throw new Error("Error al eliminar la tarea");
				getTodos();
			})
			.catch(err => console.error("Error al eliminar:", err));
	};

	const deleteAllTasks = () => {
		fetch('https://playground.4geeks.com/todo/users/Zodiax37', {
			method: 'DELETE',
		})
		.then(res => {
			if (!res.ok) throw new Error("Error al eliminar el usuario");
			return
		})
		.then(() => createUser()) 
		.catch(err => console.error("Error al eliminar todo:", err));
	};


	return (
		<div className="container mt-5 text-center">
			<h1 className="mb-4">todos</h1>

			<input type="text" className="form-control me-2 text-center" placeholder="Nueva tarea" value={task} onChange={e => setTask(e.target.value)} onKeyDown={handleEnter}/>

			<div className="mt-4">
				{tasks.map((task, index) => (
					<div key={index} className="todo-item d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
						<span>{task.label}</span>
						<button className="delete-btn btn btn-sm btn-danger" onClick={() => deleteTasks(task.id)}>X</button>
					</div>
				))}
				<small className="text-muted">
					{tasks.length === 0
						? "No tienes tareas pendientes"
						: `${tasks.length} tarea${tasks.length > 1 ? "s" : ""} pendiente${tasks.length > 1 ? "s" : ""}`}
				</small>

				{tasks.length > 0 && (<button className="btn btn-danger m-3" onClick={deleteAllTasks}>Eliminar todas las tareas</button>)}

			</div>
		</div>
	);
};

export default TodoLista;
