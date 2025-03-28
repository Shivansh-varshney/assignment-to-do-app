import React, { useState } from "react";

function TasksList({ tasks, removeTask, markTaskDone, editTask }) {

    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editPriority, setEditPriority] = useState("High");

    function handleEdit(index, text) {
        setEditIndex(index);
        setEditText(text);
        setEditDate(date || "");
    }

    function saveEdit(index) {
        editTask(index, editText, editDate, editPriority);
        setEditIndex(null);
    }

    return (
        <>
            <div className="mt-5">
                <h2 className="text-white">Task List</h2>
                <ul className="list-group">
                    {tasks.map((task, index) => (
                        <li key={index} className={`list-group-item d-flex my-2 justify-content-between align-items-center ${task.done ? 'bg-warning' : 'bg-success'}`}>
                            {editIndex === index ? (
                                <>
                                    <input

                                        type="text"
                                        className="form-control flex-grow-1"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                    />
                                    <select className="form-control" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </>
                            ) : (
                                <span
                                    className="flex-grow-1"
                                    onClick={() => markTaskDone(index)}
                                    style={{ cursor: "pointer", textDecoration: task.done ? "line-through" : "none" }}
                                >
                                    <b className="text-white">
                                        {index + 1}. {task.text}
                                        <br />
                                        {task.date && <small className="text-white d-block">Due Date: {task.date}</small>}
                                        <small className="d-block">Priority: {task.priority}</small>
                                    </b>

                                </span>
                            )}

                            <div className="d-flex gap-2">
                                {editIndex === index ? (
                                    <button className="btn btn-success btn-sm" onClick={() => saveEdit(index)}>
                                        ✅
                                    </button>
                                ) : (
                                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(index, task.text)}>
                                        🖋️
                                    </button>
                                )}
                                <button className="btn btn-danger btn-sm" onClick={() => removeTask(index)}>🗑️</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default TasksList