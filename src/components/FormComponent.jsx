import React, { useState, useEffect } from "react";
import TasksLists from './TaskList'
import ShowWeather from "./Weather";
import AskGemini from "./AskAI";

function listForm() {

    const [task, setTask] = useState("")
    const [date, setDate] = useState(""); 
    const [priority, setPriority] = useState("High");
    const [taskList, setTaskList] = useState(() => {
        const savedTasks = localStorage.getItem("taskList");
        return savedTasks ? JSON.parse(savedTasks) : [];
    })

    useEffect(() => {
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }, [taskList]);

    function handleChange(event) {
        setTask(event.target.value)
    }

    function handleDateChange(event) {
        setDate(event.target.value);
    }

    function handlePriorityChange(event) {
        setPriority(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (task.trim() !== "") {
            if (!taskList.includes(task)) {
                setTaskList(prevTaskList => [...prevTaskList, { text: task, date: date || null, priority: priority, done: false }]);
                setTask("");
                setDate("");
                setPriority("High");
            }
            else {
                alert("Task already in list.")
            }
        }
        else {
            alert("Empty task can not be added.")
        }
    }

    function markTaskDone(index) {
        setTaskList(prevTaskList =>
            prevTaskList.map((task, i) =>
                i === index ? { ...task, done: !task.done } : task
            )
        );
    }

    function removeTask(index) {
        setTaskList(prevTaskList => prevTaskList.filter((_, i) => i !== index))
    }

    function moveTaskUp(index) {
        if (index === 0) return;
        setTaskList(prevTaskList => {
            const updatedTasks = [...prevTaskList];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]]; // Swap tasks
            return updatedTasks;
        });
    }

    function moveTaskDown(index) {
        setTaskList(prevTaskList => {
            if (index >= prevTaskList.length - 1) return prevTaskList;
            const updatedTasks = [...prevTaskList];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]]; // Swap tasks
            return updatedTasks;
        });
    }

    function editTask(index, newText, newDate, newPriority) {
        setTaskList(prevTaskList =>
            prevTaskList.map((task, i) =>
                i === index ? { ...task, text: newText, date: newDate !== "" ? newDate : task.date, priority: newPriority !== "" ? newPriority : task.priority } : task
            )
        );
    }

    const sortedTasks = [...taskList].sort((a, b) => {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return (
        <>

            <div className="">
                <h1 className="text-white mb-3 justify-content-center">To Do List App</h1>
                <ShowWeather />
                <AskGemini />
                <div className="row d-flex align-items-center mb-5">
                    <div className="col-sm-5">
                        <input className="userInput text-white" type="text" value={task} onChange={handleChange} placeholder="Enter task" />
                    </div>
                    <div className="col-sm-2 mt-2 mt-sm-0">
                        <select value={priority} onChange={handlePriorityChange} className="userInput text-white">
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="col-sm-3 mt-2 mt-sm-0">
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            className="userInput text-white"
                            placeholder="Optional Due Date"
                        />
                    </div>
                    <div className="col-sm-2 d-flex justify-content-end align-self-end mt-2 mt-sm-0">
                        <button className="btn btn-success" onClick={handleSubmit} type='submit'>Add Task</button>
                    </div>
                </div>
            </div>


            {taskList.length ? <TasksLists editTask={editTask} moveTaskDown={moveTaskDown} tasks={sortedTasks} removeTask={removeTask} markTaskDone={markTaskDone} moveTaskUp={moveTaskUp} /> : <></>}
        </>
    )
}

export default listForm